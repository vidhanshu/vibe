import { MediasService } from 'src/medias/medias.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CronTasksService {
    private prisma;
    private mediasService;
    constructor(prisma: PrismaService, mediasService: MediasService);
    private readonly logger;
    expiredStatusCleanup(): Promise<void>;
}
