import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediasService } from 'src/medias/medias.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, MediasService],
})
export class PostsModule {}
