"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CronTasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronTasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const medias_service_1 = require("../medias/medias.service");
const prisma_service_1 = require("../prisma/prisma.service");
let CronTasksService = CronTasksService_1 = class CronTasksService {
    constructor(prisma, mediasService) {
        this.prisma = prisma;
        this.mediasService = mediasService;
        this.logger = new common_1.Logger(CronTasksService_1.name);
    }
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
            await this.prisma.media.deleteMany({
                where: { id: { in: expiredStatuses.map(({ id }) => id) } },
            });
            await this.mediasService.deleteFiles(expiredStatuses.map(({ key }) => key));
            this.logger.log(`Successfully cleaned up ${expiredStatuses.length} expired statuses.`);
        }
        catch (error) {
            this.logger.error('Error during expiredStatusCleanup task:', error.stack);
        }
    }
};
exports.CronTasksService = CronTasksService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_2_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronTasksService.prototype, "expiredStatusCleanup", null);
exports.CronTasksService = CronTasksService = CronTasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        medias_service_1.MediasService])
], CronTasksService);
//# sourceMappingURL=cron-tasks.service.js.map