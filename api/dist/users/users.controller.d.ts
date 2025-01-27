import { UsersService } from './users.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(filterUsersDto: FilterUsersDto): Promise<import("../common/types/return-type").PaginatedResponse<{
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
    }>>;
    getProfile(userId: string): Promise<{
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
    getUserById(id: string): Promise<{
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
    update(userId: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(userId: string): Promise<{
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
