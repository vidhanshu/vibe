import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';
import { MediasService } from 'src/medias/medias.service';
export declare class PostsService {
    private prisma;
    private mediasService;
    constructor(prisma: PrismaService, mediasService: MediasService);
    createPost(id: string, { content, title, medias }: CreatePostDto): Promise<Post>;
    getAllPosts({ limit: take, page, search, }: FilterPostDto): Promise<PaginatedResponse<Post>>;
    getPostById(id: string): Promise<Post>;
    updatePost(id: string, userId: string, { content, title }: UpdatePostDto): Promise<Post | undefined>;
    removePost(id: string, userId: string): Promise<{
        statusCode: number;
        message: string;
    } | undefined>;
}
