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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const medias_service_1 = require("../medias/medias.service");
let StatusesService = class StatusesService {
    constructor(prisma, mediasService) {
        this.prisma = prisma;
        this.mediasService = mediasService;
    }
    async addStatusView(id, userId) {
        const existingView = await this.prisma.statusView.findUnique({
            where: { viewerId_statusId: { viewerId: userId, statusId: id } },
            select: { id: true },
        });
        if (!existingView) {
            await this.prisma.statusView.create({
                data: { viewerId: userId, statusId: id },
            });
        }
    }
    async getStatuses(userId, { limit = 30, page = 1 }) {
        const where = {
            OR: [
                { userId },
                { user: { followers: { some: { followerId: userId } } } },
            ],
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        };
        const [items, count] = await Promise.all([
            this.prisma.status.findMany({
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: {
                        select: {
                            username: true,
                            id: true,
                            profilePhoto: { select: { url: true } },
                        },
                    },
                    views: { select: { viewerId: true } },
                    _count: {
                        select: {
                            views: true,
                        },
                    },
                },
                where,
            }),
            this.prisma.status.count({ where }),
        ]);
        return {
            items: items.map(({ views, ...rest }) => {
                const viewed = views.map(({ viewerId }) => viewerId).includes(userId);
                return { ...rest, viewed };
            }),
            metadata: {
                currentPage: page,
                itemsCount: items.length,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
    async addStatus(userId, { medias = [], backgroundColor, message }) {
        await this.deleteStatus(userId, true);
        if (medias.length > 0) {
            return this.prisma.status.create({
                data: {
                    userId,
                    statusType: 'media',
                    medias: {
                        create: medias,
                    },
                },
                include: { medias: true },
            });
        }
        else {
            return this.prisma.status.create({
                data: {
                    userId,
                    statusType: 'text',
                    message,
                    backgroundColor,
                },
                include: { medias: true },
            });
        }
    }
    async deleteStatus(userId, ignoreError = false) {
        const existingStatus = await this.prisma.status.findUnique({
            where: { userId },
            include: { medias: true },
        });
        if (!existingStatus && ignoreError)
            return;
        if (!existingStatus)
            throw new common_1.NotFoundException();
        if (existingStatus.statusType === 'media') {
            await this.prisma.status.delete({
                where: { id: existingStatus.id },
                include: { medias: true },
            });
            await this.mediasService.deleteFiles([
                ...existingStatus.medias.map(({ key }) => key),
            ]);
            console.log(existingStatus);
        }
        else {
            await this.prisma.status.delete({
                where: { id: existingStatus.id },
                include: { medias: true },
            });
        }
    }
};
exports.StatusesService = StatusesService;
exports.StatusesService = StatusesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        medias_service_1.MediasService])
], StatusesService);
//# sourceMappingURL=statuses.service.js.map