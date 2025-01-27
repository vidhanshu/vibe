import { PaginationDto } from 'src/common/dtos/pagination.dto';
declare const FilterCommentsDto_base: import("@nestjs/mapped-types").MappedType<Omit<PaginationDto, "search">>;
export declare class FilterCommentsDto extends FilterCommentsDto_base {
}
export {};
