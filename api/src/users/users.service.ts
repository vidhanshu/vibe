import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';
import { MediasService } from 'src/medias/medias.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async getSuggestedToFollow(
    { limit: take = 10, page = 1, search, sort }: FilterUsersDto,
    userId: string,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * take;

    // Get the users followed by the current user
    const followings = await this.prisma.user.findMany({
      where: {
        followings: {
          some: { followingId: userId }, // Users that the current user follows
        },
      },
      select: {
        id: true,
      },
    });

    const followingIds = followings.map(({ id }) => id);

    // Find potential suggestions (friends of friends)
    const suggestedUsers = await this.prisma.user.findMany({
      where: {
        followers: {
          none: { followerId: userId }, // Exclude users to whom I already follow
          some: { followerId: { in: followingIds } }, // Users followed by my followings
        },
        id: { not: userId }, // Exclude myself
        OR: search
          ? [{ username: { contains: search, mode: 'insensitive' } }]
          : undefined,
      },
      take,
      skip,
      orderBy: sort ? { [sort]: 'desc' } : undefined, // Example: sort by followers count
      include: {
        profilePhoto: true,
        followers: {
          select: { follower: { select: { username: true } } },
          take: 2,
        },
      },
    });

    // Count total suggested users
    const count = await this.prisma.user.count({
      where: {
        followers: { some: { followerId: { in: followingIds } } },
        followings: { none: { followingId: userId } },
        id: { not: userId },
      },
    });

    return {
      items: suggestedUsers,
      metadata: {
        currentPage: page,
        totalItems: count,
        itemsCount: suggestedUsers.length,
        totalPages: Math.ceil(count / take),
        limit: take,
      },
    };
  }

  async getUserById(id: string): Promise<User> {
    //TODO: Also check if the user who is requesting follows or not, for O(1) checking
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
        profilePhoto: true,
      },
    });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async getUserByUsername(
    username: string,
    currentUserId: string,
  ): Promise<User & { follows: boolean }> {
    // Also check if the user who is requesting follows or not, for O(1) checking
    const follows = await this.prisma.user.findFirst({
      where: {
        username,
        followers: {
          some: {
            followerId: currentUserId,
          },
        },
      },
      select: { id: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
        followers: {
          where: {
            follower: {
              followers: {
                some: {
                  followerId: currentUserId,
                },
              },
            },
          },
          select: {
            follower: {
              select: {
                username: true,
              },
            },
          },
          take: 2,
        },
        profilePhoto: true,
      },
    });
    if (!user) throw new NotFoundException(`User not found`);
    return { ...user, follows: !!follows };
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
