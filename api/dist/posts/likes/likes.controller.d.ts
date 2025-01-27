import { LikesService } from './likes.service';
export declare class LikesController {
    private likesService;
    constructor(likesService: LikesService);
    likeUnlike(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
    }>;
}
