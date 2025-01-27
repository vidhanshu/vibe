import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { FilterStatusesDto } from './dto/filter-statuses.dto';
export declare class StatusesController {
    private statusesService;
    constructor(statusesService: StatusesService);
    addStatusView(id: string, userId: string): Promise<void>;
    getStatuses(filterStatusesDto: FilterStatusesDto, userId: string): Promise<import("../common/types/return-type").PaginatedResponse<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string | null;
        userId: string;
        backgroundColor: string | null;
        statusType: import("@prisma/client").$Enums.StatusType;
    }>>;
    addStatus(createStatusDto: CreateStatusDto, userId: string): Promise<{
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
    deleteStatus(userId: string): Promise<void>;
}
