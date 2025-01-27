import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/common/types/return-type';
import type { User } from '@prisma/client';
import { FilterFollowsDto } from './dto/filter-follows.dto';
export declare class FollowsService {
    private prisma;
    constructor(prisma: PrismaService);
    followUnfollow({ followerId, followingId, }: {
        followerId: string;
        followingId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        followingId: string;
        followerId: string;
    }>;
    getFollowers(userId: string, { limit, page }: FilterFollowsDto): Promise<PaginatedResponse<User>>;
    getFollowing(userId: string, { limit, page }: FilterFollowsDto): Promise<PaginatedResponse<User>>;
}
