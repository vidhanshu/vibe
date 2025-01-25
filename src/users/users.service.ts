import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll({ limit: take = 10, page = 1, search, sort }: FilterUsersDto) {
    const skip = (page - 1) * take;
    const filter: Prisma.UserFindManyArgs = { skip, take };
    if (search)
      filter.where = {
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
        ],
      };

    if (sort) {
      const [field, direction] = sort.split(':');
      filter.orderBy = { [field]: direction };
    }

    const [users, count] = await Promise.all([
      this.prisma.user.findMany(filter),
      this.prisma.user.count({
        // to get the total count based on the filter
        where: filter.where,
      }),
    ]);

    return {
      items: users,
      metadata: {
        currentPage: page,
        totalItems: count,
        itemsCount: users.length,
        totalPages: Math.ceil(count / take),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: string, { email, username, password }: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);

    if (email && email !== user.email) {
    }
  }
}
