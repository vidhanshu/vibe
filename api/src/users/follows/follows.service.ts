import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/common/types/return-type';
import type { Follow, Prisma, User } from '@prisma/client';
import { FilterFollowsDto } from './dto/filter-follows.dto';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async followUnfollow({
    followerId,
    followingId,
  }: {
    followerId: string;
    followingId: string;
  }) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (follow) {
      return this.prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
    }
    return this.prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async getFollowers(
    userId: string,
    { limit = 10, page = 1 }: FilterFollowsDto,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;

    const [items, count] = await Promise.all([
      this.prisma.follow.findMany({
        skip,
        take: limit,
        where: { followingId: userId },
        include: {
          follower: {
            include: { profilePhoto: true },
          },
        },
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return {
      items: items.map(({ follower }) => follower),
      metadata: {
        currentPage: page,
        itemsCount: items.length,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getFollowing(
    userId: string,
    { limit = 10, page = 1 }: FilterFollowsDto,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;

    const [items, count] = await Promise.all([
      this.prisma.follow.findMany({
        skip,
        take: limit,
        where: { followerId: userId },
        include: {
          following: {
            include: { profilePhoto: true },
          },
        },
      }),
      this.prisma.follow.count(),
    ]);

    return {
      items: items.map(({ following }) => following),
      metadata: {
        currentPage: page,
        itemsCount: items.length,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}
