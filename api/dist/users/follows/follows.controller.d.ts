import { FollowsService } from './follows.service';
import { FilterFollowsDto } from './dto/filter-follows.dto';
export declare class FollowsController {
    private readonly followsService;
    constructor(followsService: FollowsService);
    getFollowers(filterFollowsDto: FilterFollowsDto, userId: string): Promise<import("../../common/types/return-type").PaginatedResponse<{
        id: string;
        username: string;
        email: string | null;
        password: string;
        bio: string | null;
        pronoun: string | null;
        gender: string | null;
        token: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    getFollowing(filterFollowsDto: FilterFollowsDto, userId: string): Promise<import("../../common/types/return-type").PaginatedResponse<{
        id: string;
        username: string;
        email: string | null;
        password: string;
        bio: string | null;
        pronoun: string | null;
        gender: string | null;
        token: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    followUnfollow(followingId: string, followerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        followingId: string;
        followerId: string;
    }>;
}
