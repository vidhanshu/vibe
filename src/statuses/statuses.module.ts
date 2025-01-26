import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediasService } from 'src/medias/medias.service';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService, PrismaService, MediasService],
})
export class StatusesModule {}
