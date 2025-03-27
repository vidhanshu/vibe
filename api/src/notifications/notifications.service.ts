import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginatedResponse } from 'src/common/types/return-type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(
    userId: string,
    { limit = 10, page = 1 }: PaginationDto,
  ): Promise<PaginatedResponse<Notification>> {
    const skip = (page - 1) * limit;

    const [notifications, count] = await Promise.all([
      this.prisma.notification.findMany({
        take: limit,
        skip,
        where: {
          forUserId: userId,
        },
        include: {
          byUser: {
            include: {
              profilePhoto: true,
              followers: {
                select: {
                  followerId: true,
                },
              },
            },
          },
          post: {
            include: {
              medias: true,
            },
          },
          comment: true,
          status: {
            include: {
              medias: true,
            },
          },
          forUser: {
            include: {
              profilePhoto: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.notification.count({
        where: {
          forUserId: userId,
        },
      }),
    ]);

    return {
      items: notifications.map((not) => {
        const newNot: any = { ...not };
        if (not.type === 'FOLLOW') {
          const follows = !!not.byUser?.followers?.find(
            ({ followerId }) => followerId === userId,
          );
          return {
            ...newNot,
            byUser: {
              ...newNot.byUser,
              follows,
            },
          };
        }
        delete newNot.byUser.followings;
        return newNot;
      }),
      metadata: {
        totalItems: count,
        itemsCount: notifications.length,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit,
      },
    };
  }
}
