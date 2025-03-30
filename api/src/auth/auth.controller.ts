import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CredentialsDto } from './dto/credentials.dto';
import { IsPublic } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @IsPublic()
  @Post('register')
  register(@Body() credentialsDto: CredentialsDto) {
    return this.authService.register(credentialsDto);
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Request() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @HttpCode(200)
  @Get('check-auth')
  checkAuth(@User('sub') userId: string) {
    return userId;
  }
}
