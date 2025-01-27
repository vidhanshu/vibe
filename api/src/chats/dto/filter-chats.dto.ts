import { ChatType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterChatsDto extends PaginationDto {
  @IsEnum(ChatType, { message: 'Should be either DM or GROUP' })
  @IsOptional()
  chatType: 'DM' | 'GROUP';
}
