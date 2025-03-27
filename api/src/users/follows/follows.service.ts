import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/common/types/return-type';
import { NotificationType, type User } from '@prisma/client';
import { FilterFollowsDto } from './dto/filter-follows.dto';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { SOCKET_EVENTS } from 'src/common/utils/constants';

@Injectable()
export class FollowsService {
  constructor(
    private prisma: PrismaService,
    private websocketService: WebsocketsService,
  ) {}

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

    // notification
    const exists = await this.prisma.notification.findFirst({
      where: {
        forUserId: followingId,
        byUserId: followerId,
        type: NotificationType.FOLLOW,
      },
    });
    if (!exists) {
      const notification = await this.prisma.notification.create({
        data: {
          byUserId: followerId,
          type: NotificationType.FOLLOW,
          forUserId: followingId,
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
      });
      const follows = !!notification.byUser?.followers?.find(
        ({ followerId }) => followerId === followingId,
      );
      const newNotification: any = {
        ...notification,
        byUser: { ...notification.byUser, follows },
      };
      delete newNotification.byUser.followers;
      this.websocketService.emitToUser(
        followingId,
        SOCKET_EVENTS.RECEIVE_NOTIFICATION,
        newNotification,
      );
    }
    return this.prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async getFollowers(
    userId: string,
    { limit = 10, page = 1, search }: FilterFollowsDto,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;

    const [items, count] = await Promise.all([
      this.prisma.follow.findMany({
        skip,
        take: limit,
        where: {
          followingId: userId,
          ...(search
            ? {
                follower: {
                  username: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              }
            : {}),
        },
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
    { limit = 10, page = 1, search }: FilterFollowsDto,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;

    const [items, count] = await Promise.all([
      this.prisma.follow.findMany({
        skip,
        take: limit,
        where: {
          followerId: userId,
          ...(search
            ? {
                following: {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } },
                  ],
                },
              }
            : {}),
        },
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
