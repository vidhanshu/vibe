import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FilterFollowsDto } from './dto/filter-follows.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('users/:id')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get('/followers')
  getFollowers(
    @Query() filterFollowsDto: FilterFollowsDto,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.followsService.getFollowers(userId, filterFollowsDto ?? {});
  }

  @Get('/followings')
  getFollowing(
    @Query() filterFollowsDto: FilterFollowsDto,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.followsService.getFollowing(userId, filterFollowsDto ?? {});
  }

  // Follow/Unfollow a user
  @Post('follows')
  followUnfollow(
    @Param('id', ParseUUIDPipe) followingId: string,
    @User('sub') followerId: string,
  ) {
    return this.followsService.followUnfollow({ followerId, followingId });
  }
}
