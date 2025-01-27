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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CommentsService = class CommentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getComments(postId, { limit = 10, page = 1 }) {
        const filter = {
            where: { postId },
            skip: (page - 1) * limit,
            take: limit,
        };
        const [items, count] = await Promise.all([
            this.prisma.comment.findMany(filter),
            this.prisma.comment.count({
                where: { postId },
            }),
        ]);
        return {
            items,
            metadata: {
                limit,
                currentPage: page,
                totalItems: count,
                itemsCount: items.length,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
    createComment(userId, postId, createdCommentDto) {
        return this.prisma.comment.create({
            data: { ...createdCommentDto, postId, userId },
        });
    }
    async updateComment(userId, postId, commentId, updateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            throw new common_1.NotFoundException();
        if (comment.userId !== userId || comment.postId !== postId) {
            throw new common_1.UnauthorizedException();
        }
        return this.prisma.comment.update({
            where: { id: commentId },
            data: updateCommentDto,
        });
    }
    async deleteComment(userId, postId, commentId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment)
            throw new common_1.NotFoundException();
        if (comment.userId !== userId || comment.postId !== postId) {
            throw new common_1.UnauthorizedException();
        }
        return this.prisma.comment.delete({
            where: { id: commentId },
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map