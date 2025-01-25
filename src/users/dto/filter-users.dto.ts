import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterUsersDto extends PaginationDto {
  @IsOptional()
  @IsIn(['createdAt:asc', 'createdAt:desc'], {
    message:
      'Invalid sort option. Allowed values are: createdAt:asc, createdAt:desc',
  })
  sort: string;
}
