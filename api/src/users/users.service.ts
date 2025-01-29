import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResponse } from 'src/common/types/return-type';
import { MediasService } from 'src/medias/medias.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mediasService: MediasService,
  ) {}

  async getUsers({
    limit: take = 10,
    page = 1,
    search,
    sort,
  }: FilterUsersDto): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * take;
    const filter: Prisma.UserFindManyArgs = {
      skip,
      take,
      include: {
        profilePhoto: true,
        _count: { select: { followers: true, followings: true } },
      },
    };
    if (search)
      filter.where = {
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
        ],
      };

    if (sort) {
      const [field, direction] = sort.split(':');
      filter.orderBy = { [field]: direction };
    }

    const [users, count] = await Promise.all([
      this.prisma.user.findMany(filter),
      this.prisma.user.count({
        // to get the total count based on the filter
        where: filter.where,
      }),
    ]);

    return {
      items: users,
      metadata: {
        currentPage: page,
        totalItems: count,
        itemsCount: users.length,
        totalPages: Math.ceil(count / take),
        limit: take,
      },
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async updateUser(
    id: string,
    { profilePhoto, ...updateUserDto }: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profilePhoto: true },
    });
    if (!user) throw new NotFoundException(`User not found`);

    const data: Prisma.UserUpdateInput = { ...updateUserDto };
    if (
      user.profilePhoto &&
      profilePhoto?.key &&
      user.profilePhoto.key !== profilePhoto.key
    ) {
      await this.mediasService.deleteFiles([user.profilePhoto.key]);
      data.profilePhoto = {
        create: profilePhoto,
      };
    } else if (!user.profilePhoto) {
      data.profilePhoto = {
        create: profilePhoto,
      };
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: { profilePhoto: true },
    });
  }

  async deleteAccount(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User not found`);

    return this.prisma.user.delete({ where: { id } });
  }
}
