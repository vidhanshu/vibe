import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async likeUnlike(postId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (like) {
      return this.prisma.like.delete({
        where: { postId_userId: { postId, userId } },
      });
    }
    return this.prisma.like.create({
      data: { postId, userId },
    });
  }
}
