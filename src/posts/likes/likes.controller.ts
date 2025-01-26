import {
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('posts/:id/like-unlike')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @HttpCode(200)
  @Post()
  likeUnlike(
    @Param('id', ParseUUIDPipe) id: string,
    @User('sub') userId: string,
  ) {
    return this.likesService.likeUnlike(id, userId);
  }
}
