import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediasService } from 'src/medias/medias.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MediasService],
})
export class UsersModule {}
