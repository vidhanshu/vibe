"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsController = void 0;
const common_1 = require("@nestjs/common");
const follows_service_1 = require("./follows.service");
const filter_follows_dto_1 = require("./dto/filter-follows.dto");
const user_decorator_1 = require("../../common/decorators/user.decorator");
let FollowsController = class FollowsController {
    constructor(followsService) {
        this.followsService = followsService;
    }
    getFollowers(filterFollowsDto, userId) {
        return this.followsService.getFollowers(userId, filterFollowsDto ?? {});
    }
    getFollowing(filterFollowsDto, userId) {
        return this.followsService.getFollowing(userId, filterFollowsDto ?? {});
    }
    followUnfollow(followingId, followerId) {
        return this.followsService.followUnfollow({ followerId, followingId });
    }
};
exports.FollowsController = FollowsController;
__decorate([
    (0, common_1.Get)('/followers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_follows_dto_1.FilterFollowsDto, String]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)('/followings'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_follows_dto_1.FilterFollowsDto, String]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.Post)('follows'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FollowsController.prototype, "followUnfollow", null);
exports.FollowsController = FollowsController = __decorate([
    (0, common_1.Controller)('users/:id'),
    __metadata("design:paramtypes", [follows_service_1.FollowsService])
], FollowsController);
//# sourceMappingURL=follows.controller.js.map