import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment, NotificationType, Prisma } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { FilterCommentsDto } from './dto/filter-comments.dto';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { SOCKET_EVENTS } from 'src/common/utils/constants';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private websocketService: WebsocketsService,
  ) {}

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
            name: true,
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

  async createComment(
    userId: string,
    postId: string,
    createdCommentDto: CreateCommentDto,
  ) {
    const comment = await this.prisma.comment.create({
      data: { ...createdCommentDto, postId, userId },
    });

    const postUser = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (postUser?.userId !== userId && postUser && comment) {
      const notification = await this.prisma.notification.create({
        data: {
          postId,
          byUserId: userId,
          type: NotificationType.COMMENT,
          forUserId: postUser.userId,
          commentId: comment.id,
        },
        include: {
          byUser: {
            include: {
              profilePhoto: true,
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
      this.websocketService.emitToUser(
        postUser.userId,
        SOCKET_EVENTS.RECEIVE_NOTIFICATION,
        notification,
      );
    }

    return comment;
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
