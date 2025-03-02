import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

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
