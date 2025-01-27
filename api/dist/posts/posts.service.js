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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const medias_service_1 = require("../medias/medias.service");
let PostsService = class PostsService {
    constructor(prisma, mediasService) {
        this.prisma = prisma;
        this.mediasService = mediasService;
    }
    createPost(id, { content, title, medias }) {
        const data = {
            title,
            content,
            user: { connect: { id } },
        };
        if (medias.length)
            data.medias = { create: medias };
        return this.prisma.post.create({ data, include: { medias: true } });
    }
    async getAllPosts({ limit: take = 10, page = 1, search, }) {
        const skip = (page - 1) * take;
        const filter = {
            take,
            skip,
            include: {
                medias: true,
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        };
        if (search) {
            filter.where = { title: { contains: search, mode: 'insensitive' } };
        }
        const [posts, count] = await Promise.all([
            this.prisma.post.findMany(filter),
            this.prisma.post.count({
                where: filter.where,
            }),
        ]);
        return {
            items: posts,
            metadata: {
                totalItems: count,
                itemsCount: posts.length,
                totalPages: Math.ceil(count / take),
                currentPage: page,
                limit: take,
            },
        };
    }
    async getPostById(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: { medias: true },
        });
        if (!post)
            throw new common_1.NotFoundException(`Post #${id} not found`);
        return post;
    }
    async updatePost(id, userId, { content, title }) {
        try {
            return await this.prisma.post.update({
                where: { id, userId },
                data: { title, content },
                include: { medias: true },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Post #${id} not found`);
            }
        }
    }
    async removePost(id, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id, userId },
            include: { medias: true },
        });
        if (!post)
            throw new common_1.NotFoundException(`Post #${id} not found`);
        await this.prisma.post.delete({
            where: { id, userId },
            select: { id: true },
        });
        if (post.medias.length) {
            await this.mediasService.deleteFiles(post.medias.map(({ key }) => key));
        }
        return { statusCode: 200, message: 'Post deleted successfully' };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        medias_service_1.MediasService])
], PostsService);
//# sourceMappingURL=posts.service.js.map