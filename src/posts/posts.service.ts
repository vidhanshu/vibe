import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post, Prisma } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types/return-type';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto): Promise<Post> {
    // TODO: user will be taken from the request
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId: '72c837b4-babe-42e5-9122-f25590e14f4e',
      },
      include: { user: true },
    });
  }

  async findAll({
    limit: take = 10,
    page = 1,
    search,
  }: FilterPostDto): Promise<PaginatedResponse<Post>> {
    const skip = (page - 1) * take;
    const filter: Prisma.PostFindManyArgs = { take, skip };
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

  async findOne(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }

  async update(
    id: string,
    { content, title }: UpdatePostDto,
  ): Promise<Post | undefined> {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: { title, content },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Post #${id} not found`);
      }
    }
  }

  async remove(
    id: string,
  ): Promise<{ statusCode: number; message: string } | undefined> {
    try {
      await this.prisma.post.delete({ where: { id } });
      return { statusCode: 200, message: 'Post deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException();
      }
    }
  }
}
