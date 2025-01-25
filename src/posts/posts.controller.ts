import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AccessTokenPayload } from 'src/auth/types/jwt';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @User('sub') userId: string,
  ) {
    return this.postsService.createPost(userId, createPostDto);
  }

  @Get()
  getAllPosts(@Query() filterPostDto: FilterPostDto) {
    return this.postsService.getAllPosts(filterPostDto);
  }

  @Get(':id')
  getPostById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User('sub') userId: string,
  ) {
    return this.postsService.updatePost(id, userId, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @User('sub') userId: string) {
    return this.postsService.removePost(id, userId);
  }
}
