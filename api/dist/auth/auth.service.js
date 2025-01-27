"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_utils_1 = require("../common/utils/crypto.utils");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(username, password) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                password: true,
            },
        });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('Password does not match');
        }
        return user;
    }
    async login({ username, id, }) {
        const accessToken = this.jwtService.sign({ sub: id, username });
        const encryptedToken = (0, crypto_utils_1.encryptToken)(accessToken, this.configService.get('ENCRYPTION_KEY') || 'your-encryption-key');
        await this.prisma.user.update({
            where: { id: id },
            data: { token: encryptedToken },
            select: { id: true },
        });
        return { accessToken };
    }
    async register(credentialsDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: credentialsDto.username },
            select: { id: true },
        });
        if (existingUser)
            throw new common_1.BadRequestException('username already exists');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(credentialsDto.password, salt);
        const data = {
            ...credentialsDto,
            password: hashedPassword,
        };
        try {
            const user = await this.prisma.user.create({ data });
            return this.login(user);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('User already exists');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async logout(id) {
        await this.prisma.user.update({
            where: { id },
            data: { token: null },
        });
        return { statusCode: 200, message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map