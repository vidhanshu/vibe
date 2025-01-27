import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(
    email: string,
    password: string,
  ): Promise<{ id: string; username: string }> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      username: user.username,
    };
  }
}
