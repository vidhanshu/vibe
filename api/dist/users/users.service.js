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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const medias_service_1 = require("../medias/medias.service");
let UsersService = class UsersService {
    constructor(prisma, mediasService) {
        this.prisma = prisma;
        this.mediasService = mediasService;
    }
    async getUsers({ limit: take = 10, page = 1, search, sort, }) {
        const skip = (page - 1) * take;
        const filter = {
            skip,
            take,
            include: {
                profilePhoto: true,
                _count: { select: { followers: true, followings: true } },
            },
        };
        if (search)
            filter.where = {
                OR: [
                    { username: { contains: search } },
                    { email: { contains: search } },
                ],
            };
        if (sort) {
            const [field, direction] = sort.split(':');
            filter.orderBy = { [field]: direction };
        }
        const [users, count] = await Promise.all([
            this.prisma.user.findMany(filter),
            this.prisma.user.count({
                where: filter.where,
            }),
        ]);
        return {
            items: users,
            metadata: {
                currentPage: page,
                totalItems: count,
                itemsCount: users.length,
                totalPages: Math.ceil(count / take),
                limit: take,
            },
        };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`User #${id} not found`);
        return user;
    }
    async updateUser(id, { profilePhoto, ...updateUserDto }) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { profilePhoto: true },
        });
        if (!user)
            throw new common_1.NotFoundException(`User #${id} not found`);
        const data = { ...updateUserDto };
        if (user.profilePhoto &&
            profilePhoto?.key &&
            user.profilePhoto.key !== profilePhoto.key) {
            await this.mediasService.deleteFiles([user.profilePhoto.key]);
            data.profilePhoto = {
                create: profilePhoto,
            };
        }
        else if (!user.profilePhoto) {
            data.profilePhoto = {
                create: profilePhoto,
            };
        }
        return this.prisma.user.update({
            where: { id },
            data,
            include: { profilePhoto: true },
        });
    }
    async deleteAccount(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`User #${id} not found`);
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        medias_service_1.MediasService])
], UsersService);
//# sourceMappingURL=users.service.js.map