"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_post_dto_1 = require("./create-post.dto");
const any_of_pipe_1 = require("../../common/pipes/any-of.pipe");
let UpdatePostDto = class UpdatePostDto extends (0, mapped_types_1.OmitType)((0, mapped_types_1.PartialType)(create_post_dto_1.CreatePostDto), [
    'medias',
]) {
};
exports.UpdatePostDto = UpdatePostDto;
exports.UpdatePostDto = UpdatePostDto = __decorate([
    (0, any_of_pipe_1.AnyOf)(['title', 'content'])
], UpdatePostDto);
//# sourceMappingURL=update-post.dto.js.map