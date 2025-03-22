import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateway } from './chats.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MediasService } from 'src/medias/medias.service';

@Module({
  imports: [JwtModule],
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, ChatGateway, MediasService],
})
export class ChatsModule {}
