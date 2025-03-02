import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { FilterCommentsDto } from './dto/filter-comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getComments(
    postId: string,
    { limit = 10, page = 1 }: FilterCommentsDto,
  ): Promise<PaginatedResponse<Comment>> {
    const filter: Prisma.CommentFindManyArgs = {
      where: { postId },
      skip: (page - 1) * limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    };

    const [items, count] = await Promise.all([
      this.prisma.comment.findMany(filter),
      this.prisma.comment.count({
        where: { postId },
      }),
    ]);

    return {
      items,
      metadata: {
        limit,
        currentPage: page,
        totalItems: count,
        itemsCount: items.length,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  createComment(
    userId: string,
    postId: string,
    createdCommentDto: CreateCommentDto,
  ) {
    return this.prisma.comment.create({
      data: { ...createdCommentDto, postId, userId },
    });
  }

  async updateComment(
    userId: string,
    postId: string,
    commentId: string,
    updateCommentDto: CreateCommentDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException();
    if (comment.userId !== userId || comment.postId !== postId) {
      throw new UnauthorizedException();
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
    });
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException();
    if (comment.userId !== userId || comment.postId !== postId) {
      throw new UnauthorizedException();
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
