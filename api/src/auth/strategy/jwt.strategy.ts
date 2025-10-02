//jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccessTokenPayload } from '../types/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { decryptToken } from 'src/common/utils/crypto.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload) {
    console.log(req.cookies);
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); // Extract token from header
    if (!token) {
      throw new UnauthorizedException();
    }

    const userToken = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { token: true },
    });

    if (!userToken?.token) {
      throw new UnauthorizedException();
    }

    const decryptedToken = decryptToken(
      userToken.token,
      this.configService.get<string>('ENCRYPTION_KEY') || 'your-encryption-key',
    );

    const isValidToken = decryptedToken === token; // Check if the token is valid

    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    return payload; // Return the payload to continue
  }
}
