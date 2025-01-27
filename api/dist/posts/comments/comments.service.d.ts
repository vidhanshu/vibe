import { CreateCommentDto } from './dto/create-comment-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterCommentsDto } from './dto/filter-comments.dto';
import { Comment, Prisma } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getComments(postId: string, { limit, page }: FilterCommentsDto): Promise<PaginatedResponse<Comment>>;
    createComment(userId: string, postId: string, createdCommentDto: CreateCommentDto): Prisma.Prisma__CommentClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateComment(userId: string, postId: string, commentId: string, updateCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }>;
    deleteComment(userId: string, postId: string, commentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
        content: string;
    }>;
}
