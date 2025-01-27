import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CredentialsDto } from './dto/credentials.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    validateUser(username: string, password: string): Promise<{
        username: string;
        id: string;
    }>;
    login({ username, id, }: {
        username: string;
        id: string;
    }): Promise<{
        accessToken: string;
    }>;
    register(credentialsDto: CredentialsDto): Promise<{
        accessToken: string;
    } | BadRequestException>;
    logout(id: string): Promise<{
        statusCode: number;
        message: string;
    }>;
}
