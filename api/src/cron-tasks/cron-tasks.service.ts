import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MediasService } from 'src/medias/medias.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronTasksService {
  constructor(
    private prisma: PrismaService,
    private mediasService: MediasService,
  ) {}

  private readonly logger = new Logger(CronTasksService.name);

  @Cron(CronExpression.EVERY_2_HOURS)
  async expiredStatusCleanup() {
    this.logger.log('Starting expiredStatusCleanup task...');
    try {
      const expiredStatuses = await this.prisma.media.findMany({
        where: {
          createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      if (!expiredStatuses.length) {
        this.logger.log('No expired statuses found for cleanup.');
        return;
      }

      // Intentionally kept sequential
      await this.prisma.media.deleteMany({
        where: { id: { in: expiredStatuses.map(({ id }) => id) } },
      });
      await this.mediasService.deleteFiles(
        expiredStatuses.map(({ key }) => key),
      );

      this.logger.log(
        `Successfully cleaned up ${expiredStatuses.length} expired statuses.`,
      );
    } catch (error) {
      this.logger.error('Error during expiredStatusCleanup task:', error.stack);
    }
  }
}
