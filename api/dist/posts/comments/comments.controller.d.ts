import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { FilterCommentsDto } from './dto/filter-comments.dto';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    getComments(postId: string, filterCommentsDto: FilterCommentsDto): Promise<import("../../common/types/return-type").PaginatedResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }>>;
    createComment(userId: string, postId: string, createdCommentDto: CreateCommentDto): import("@prisma/client").Prisma.Prisma__CommentClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateComment(userId: string, postId: string, commentsId: string, updateCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }>;
    deleteComment(userId: string, postId: string, commentsId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }>;
}
