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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { User } from 'src/common/decorators/user.decorator';
import { FilterCommentsDto } from './dto/filter-comments.dto';

@Controller('posts/:id/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  getComments(
    @Param('id', ParseUUIDPipe) postId: string,
    @Query() filterCommentsDto: FilterCommentsDto,
  ) {
    return this.commentsService.getComments(postId, filterCommentsDto);
  }

  @Post()
  createComment(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() createdCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(
      userId,
      postId,
      createdCommentDto,
    );
  }

  @Patch(':commentId')
  updateComment(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentsId: string,
    @Body() updateCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.updateComment(
      userId,
      postId,
      commentsId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  deleteComment(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentsId: string,
  ) {
    return this.commentsService.deleteComment(userId, postId, commentsId);
  }
}
