import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediasService } from 'src/medias/medias.service';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [LikesModule, CommentsModule],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, MediasService],
})
export class PostsModule {}
