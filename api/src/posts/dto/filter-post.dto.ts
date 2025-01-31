import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterPostDto extends PaginationDto {
  @IsString()
  @IsOptional()
  username: string;
}
