import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { FilterStatusesDto } from './dto/filter-statuses.dto';
import { PaginatedResponse } from 'src/common/types/return-type';
import { Status } from '@prisma/client';
import { MediasService } from 'src/medias/medias.service';
export declare class StatusesService {
    private prisma;
    private mediasService;
    constructor(prisma: PrismaService, mediasService: MediasService);
    addStatusView(id: string, userId: string): Promise<void>;
    getStatuses(userId: string, { limit, page }: FilterStatusesDto): Promise<PaginatedResponse<Status>>;
    addStatus(userId: string, { medias, backgroundColor, message }: CreateStatusDto): Promise<{
        medias: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            key: string;
            mediaType: import("@prisma/client").$Enums.MediaType;
            postId: string | null;
            userId: string | null;
            statusId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string | null;
        userId: string;
        backgroundColor: string | null;
        statusType: import("@prisma/client").$Enums.StatusType;
    }>;
    deleteStatus(userId: string, ignoreError?: boolean): Promise<void>;
}
