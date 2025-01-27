"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterCommentsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const pagination_dto_1 = require("../../../common/dtos/pagination.dto");
class FilterCommentsDto extends (0, mapped_types_1.OmitType)(pagination_dto_1.PaginationDto, ['search']) {
}
exports.FilterCommentsDto = FilterCommentsDto;
//# sourceMappingURL=filter-comments.dto.js.map