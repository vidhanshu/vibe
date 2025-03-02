import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { AccessTokenPayload } from 'src/auth/types/jwt';
import { User } from 'src/common/decorators/user.decorator';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query() filterUsersDto: FilterUsersDto) {
    return this.usersService.getUsers(filterUsersDto);
  }

  @Get('/suggested-to-follow')
  getSuggestedToFollow(@Query() filterUsersDto: FilterUsersDto, @User() user: AccessTokenPayload) {
    return this.usersService.getSuggestedToFollow(filterUsersDto,user.sub);
  }

  @Get('/profile')
  getProfile(@User('sub') userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('/username/:username')
  getUserByUsername(
    @Param('username') username: string,
    @User('sub') currentUserId: string,
  ) {
    return this.usersService.getUserByUsername(username, currentUserId);
  }

  @Patch('profile')
  update(@User('sub') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('profile')
  remove(@User('sub') userId: string) {
    return this.usersService.deleteAccount(userId);
  }
}
