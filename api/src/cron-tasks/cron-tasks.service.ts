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
      const expiredStatuses = await this.prisma.status.findMany({
        where: {
          createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        select: { id: true, medias: { select: { key: true } } },
      });

      if (!expiredStatuses.length) {
        this.logger.log('No expired statuses found for cleanup.');
        return;
      }

      const mediasToDelete = expiredStatuses.map(({ medias }) => medias).flat();

      // Intentionally kept sequential
      await this.prisma.status.deleteMany({ // (there is cascade on medias for status relation)
        where: { id: { in: expiredStatuses.map(({ id }) => id) } },
      });
      if (mediasToDelete.length) {
        await this.mediasService.deleteFiles(
          mediasToDelete.map(({ key }) => key),
        );
      }

      this.logger.log(
        `Successfully cleaned up ${expiredStatuses.length} expired statuses.`,
      );
    } catch (error) {
      this.logger.error('Error during expiredStatusCleanup task:', error.stack);
    }
  }
}
