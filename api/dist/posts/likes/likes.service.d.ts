import { PrismaService } from 'src/prisma/prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    likeUnlike(postId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        userId: string;
    }>;
}
