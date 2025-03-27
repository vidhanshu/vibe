import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { SOCKET_EVENTS } from 'src/common/utils/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';

@Injectable()
export class LikesService {
  constructor(
    private prisma: PrismaService,
    private websocketService: WebsocketsService,
  ) {}

  async likeUnlike(postId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (like) {
      return this.prisma.like.delete({
        where: { postId_userId: { postId, userId } },
      });
    }

    // notification
    const exists = await this.prisma.notification.findFirst({
      where: {
        postId,
        byUserId: userId,
        type: NotificationType.LIKE,
      },
    });
    if (!exists) {
      const postUser = await this.prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (postUser?.userId !== userId && postUser) {
        const notification = await this.prisma.notification.create({
          data: {
            postId,
            byUserId: userId,
            type: NotificationType.LIKE,
            forUserId: postUser?.userId,
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
    }

    return this.prisma.like.create({
      data: { postId, userId },
    });
  }
}
