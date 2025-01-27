import { OmitType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterMessagesDto extends OmitType(PaginationDto, ['search']) {}
