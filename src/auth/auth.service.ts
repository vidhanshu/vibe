import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CredentialsDto } from './dto/credentials.dto';
import { encryptToken } from 'src/common/utils/crypto.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; id: string }> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login({
    username,
    id,
  }: {
    username: string;
    id: string;
  }): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign({ sub: id, username });

    const encryptedToken = encryptToken(
      accessToken,
      this.configService.get<string>('ENCRYPTION_KEY') || 'your-encryption-key',
    );

    // update the token
    await this.prisma.user.update({
      where: { id: id },
      data: { token: encryptedToken },
      select: { id: true },
    });

    return { accessToken };
  }

  async register(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string } | BadRequestException> {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: credentialsDto.username },
      select: { id: true },
    });

    if (existingUser) throw new BadRequestException('username already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(credentialsDto.password, salt);

    const data: Prisma.UserCreateInput = {
      ...credentialsDto,
      password: hashedPassword,
    };
    try {
      const user = await this.prisma.user.create({ data });
      return this.login(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async logout(id: string): Promise<{ statusCode: number; message: string }> {
    await this.prisma.user.update({
      where: { id },
      data: { token: null },
    });

    return { statusCode: 200, message: 'Logged out successfully' };
  }
}
