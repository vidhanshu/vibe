import { Module } from '@nestjs/common';
import { CronTasksService } from './cron-tasks.service';
import { CronTasksController } from './cron-tasks.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediasService } from 'src/medias/medias.service';

@Module({
  controllers: [CronTasksController],
  providers: [CronTasksService, PrismaService, MediasService],
})
export class CronTasksModule {}
