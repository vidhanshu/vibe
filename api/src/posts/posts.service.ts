import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';
import { MediasService } from 'src/medias/medias.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private mediasService: MediasService,
  ) {}

  createPost(
    id: string,
    { content, title, medias }: CreatePostDto,
  ): Promise<Post> {
    const data: Prisma.PostCreateInput = {
      title,
      content,
      user: { connect: { id } },
    };
    if (medias.length) data.medias = { create: medias };

    return this.prisma.post.create({ data, include: { medias: true } });
  }

  async getAllPosts({
    limit: take = 10,
    page = 1,
    search,
    username,
  }: FilterPostDto): Promise<PaginatedResponse<Post>> {
    const skip = (page - 1) * take;
    const filter: Prisma.PostFindManyArgs = {
      take,
      skip,
      include: {
        user: {
          select: {
            id: true,
            profilePhoto: true,
            username: true,
          },
        },
        medias: true,
        likes: { select: { userId: true } },
        savedBy: { select: { id: true } },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    };
    if (search) {
      filter.where = { title: { contains: search, mode: 'insensitive' } };
    }

    if (username) {
      filter.where = { user: { username } };
    }

    const [posts, count] = await Promise.all([
      this.prisma.post.findMany(filter) as Promise<Post[]>,
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

  async getAllSavedPosts(
    { limit: take = 10, page = 1, search }: FilterPostDto,
    userId: string,
  ): Promise<PaginatedResponse<Post>> {
    const skip = (page - 1) * take;

    const baseWhere: Prisma.PostWhereInput = {
      savedBy: { some: { id: userId } },
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    };

    const filter: Prisma.PostFindManyArgs = {
      take,
      skip,
      where: baseWhere,
      include: {
        user: {
          select: { id: true, profilePhoto: true, username: true },
        },
        medias: true,
        likes: { select: { userId: true } },
        savedBy: { select: { id: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    };

    const [posts, count] = await Promise.all([
      this.prisma.post.findMany(filter),
      this.prisma.post.count({ where: baseWhere }),
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

  async getPostById(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        medias: true,
        user: true,
        _count: true,
        savedBy: { select: { id: true } },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }

  async updatePost(
    id: string,
    userId: string,
    { content, title }: UpdatePostDto,
  ): Promise<Post | undefined> {
    try {
      return await this.prisma.post.update({
        where: { id, userId },
        data: { title, content },
        include: { medias: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Post #${id} not found`);
      }
    }
  }

  async removePost(
    id: string,
    userId: string,
  ): Promise<{ statusCode: number; message: string } | undefined> {
    const post = await this.prisma.post.findUnique({
      where: { id, userId },
      include: { medias: true },
    });
    if (!post) throw new NotFoundException(`Post #${id} not found`);

    await this.prisma.post.delete({
      where: { id, userId },
      select: { id: true },
    });

    if (post.medias.length) {
      await this.mediasService.deleteFiles(post.medias.map(({ key }) => key));
    }

    return { statusCode: 200, message: 'Post deleted successfully' };
  }

  async toggleSavePost(
    postId: string,
    userId: string,
  ): Promise<{ statusCode: number; message: string }> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (post?.userId === userId) {
      throw new BadRequestException("You can't save your own posts");
    }
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const alreadySaved = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
        savedBy: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });

    const operation = alreadySaved?.savedBy.length ? 'disconnect' : 'connect';
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        savedBy: {
          [operation]: { id: userId },
        },
      },
    });

    return {
      statusCode: 200,
      message: `Post ${operation === 'connect' ? 'saved' : 'un saved'} successfully`,
    };
  }
}
