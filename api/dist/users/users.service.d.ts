import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResponse } from 'src/common/types/return-type';
import { MediasService } from 'src/medias/medias.service';
export declare class UsersService {
    private prisma;
    private mediasService;
    constructor(prisma: PrismaService, mediasService: MediasService);
    getUsers({ limit: take, page, search, sort, }: FilterUsersDto): Promise<PaginatedResponse<User>>;
    getUserById(id: string): Promise<User>;
    updateUser(id: string, { profilePhoto, ...updateUserDto }: UpdateUserDto): Promise<User>;
    deleteAccount(id: string): Promise<{
        id: string;
        username: string;
        email: string | null;
        password: string;
        bio: string | null;
        pronoun: string | null;
        gender: string | null;
        token: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
