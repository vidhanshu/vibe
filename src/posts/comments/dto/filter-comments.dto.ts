import { OmitType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterCommentsDto extends OmitType(PaginationDto, ['search']) {}
