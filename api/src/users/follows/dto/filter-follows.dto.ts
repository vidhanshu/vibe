import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterFollowsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search: string;
}
