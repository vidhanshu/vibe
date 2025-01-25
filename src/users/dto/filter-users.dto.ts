import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @IsIn(['createdAt:asc', 'createdAt:desc'], {
    message:
      'Invalid sort option. Allowed values are: createdAt:asc, createdAt:desc',
  })
  sort: string;
}
