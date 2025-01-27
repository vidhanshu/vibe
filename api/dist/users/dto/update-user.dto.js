"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_dto_1 = require("./create-user.dto");
const any_of_pipe_1 = require("../../common/pipes/any-of.pipe");
let UpdateUserDto = class UpdateUserDto extends (0, mapped_types_1.OmitType)((0, mapped_types_1.PartialType)(create_user_dto_1.CreateUserDto), [
    'password',
    'email',
    'username',
]) {
};
exports.UpdateUserDto = UpdateUserDto;
exports.UpdateUserDto = UpdateUserDto = __decorate([
    (0, any_of_pipe_1.AnyOf)(['bio', 'gender', 'pronoun', 'profilePhoto'])
], UpdateUserDto);
//# sourceMappingURL=update-user.dto.js.map