import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { FilterStatusesDto } from './dto/filter-statuses.dto';
import { PaginatedResponse } from 'src/common/types/return-type';
import { Prisma, Status } from '@prisma/client';
import { MediasService } from 'src/medias/medias.service';

@Injectable()
export class StatusesService {
  constructor(
    private prisma: PrismaService,
    private mediasService: MediasService,
  ) {}

  async addStatusView(id: string, userId: string) {
    // Allow self view
    // const existingStatus = await this.prisma.status.findUnique({
    //   where: { id },
    //   select: { userId: true },
    // });

    // if (existingStatus?.userId === userId) {
    //   throw new BadRequestException("Can't add a view for your own status");
    // }

    const existingView = await this.prisma.statusView.findUnique({
      where: { viewerId_statusId: { viewerId: userId, statusId: id } },
      select: { id: true },
    });
    if (!existingView) {
      await this.prisma.statusView.create({
        data: { viewerId: userId, statusId: id },
      });
    }
  }

  async getStatuses(
    userId: string,
    { limit = 30, page = 1 }: FilterStatusesDto,
  ): Promise<PaginatedResponse<Status>> {
    const where = {
      OR: [
        //  get the statuses of the users to whom I follow, and my status
        { userId },
        { user: { followers: { some: { followerId: userId } } } },
      ],
      // get statuses that are created in the last 24 hours
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    };

    const [items, count] = await Promise.all([
      this.prisma.status.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              username: true,
              id: true,
              profilePhoto: { select: { url: true } },
            },
          },
          views: { select: { viewerId: true } },
          _count: {
            select: {
              views: true,
            },
          },
        },
        where,
      }),
      this.prisma.status.count({ where }),
    ]);

    return {
      items: items.map(({ views, ...rest }) => {
        const viewed = views.map(({ viewerId }) => viewerId).includes(userId);
        return { ...rest, viewed };
      }),
      metadata: {
        currentPage: page,
        itemsCount: items.length,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async addStatus(
    userId: string,
    { medias = [], backgroundColor, message }: CreateStatusDto,
  ) {
    // delete existing status if any
    await this.deleteStatus(userId, true);

    if (medias.length > 0) {
      return this.prisma.status.create({
        data: {
          userId,
          statusType: 'media',
          medias: {
            create: medias,
          },
        },
        include: { medias: true },
      });
    } else {
      return this.prisma.status.create({
        data: {
          userId,
          statusType: 'text',
          message,
          backgroundColor,
        },
        include: { medias: true },
      });
    }
  }

  async deleteStatus(userId: string, ignoreError = false) {
    const existingStatus = await this.prisma.status.findUnique({
      where: { userId },
      include: { medias: true },
    });

    if (!existingStatus && ignoreError) return;

    if (!existingStatus) throw new NotFoundException();

    if (existingStatus.statusType === 'media') {
      // Intentionally kept sequential
      await this.prisma.status.delete({
        where: { id: existingStatus.id },
        include: { medias: true },
      });
      await this.mediasService.deleteFiles([
        ...existingStatus.medias.map(({ key }) => key),
      ]);

      console.log(existingStatus);
    } else {
      await this.prisma.status.delete({
        where: { id: existingStatus.id },
        include: { medias: true },
      });
    }
  }
}
