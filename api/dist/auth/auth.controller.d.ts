import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        accessToken: string;
    }>;
    register(credentialsDto: CredentialsDto): Promise<import("@nestjs/common").BadRequestException | {
        accessToken: string;
    }>;
    logout(req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
}
