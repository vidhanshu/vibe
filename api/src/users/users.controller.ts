import {
  Controller,
  Get,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AccessTokenPayload } from 'src/auth/types/jwt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query() filterUsersDto: FilterUsersDto) {
    return this.usersService.getUsers(filterUsersDto);
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
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
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
