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
exports.StatusesController = void 0;
const common_1 = require("@nestjs/common");
const statuses_service_1 = require("./statuses.service");
const create_status_dto_1 = require("./dto/create-status.dto");
const user_decorator_1 = require("../common/decorators/user.decorator");
const filter_statuses_dto_1 = require("./dto/filter-statuses.dto");
let StatusesController = class StatusesController {
    constructor(statusesService) {
        this.statusesService = statusesService;
    }
    addStatusView(id, userId) {
        return this.statusesService.addStatusView(id, userId);
    }
    getStatuses(filterStatusesDto, userId) {
        return this.statusesService.getStatuses(userId, filterStatusesDto);
    }
    addStatus(createStatusDto, userId) {
        return this.statusesService.addStatus(userId, createStatusDto);
    }
    deleteStatus(userId) {
        return this.statusesService.deleteStatus(userId);
    }
};
exports.StatusesController = StatusesController;
__decorate([
    (0, common_1.Post)(':id/add-view'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StatusesController.prototype, "addStatusView", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_statuses_dto_1.FilterStatusesDto, String]),
    __metadata("design:returntype", void 0)
], StatusesController.prototype, "getStatuses", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_status_dto_1.CreateStatusDto, String]),
    __metadata("design:returntype", void 0)
], StatusesController.prototype, "addStatus", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatusesController.prototype, "deleteStatus", null);
exports.StatusesController = StatusesController = __decorate([
    (0, common_1.Controller)('statuses'),
    __metadata("design:paramtypes", [statuses_service_1.StatusesService])
], StatusesController);
//# sourceMappingURL=statuses.controller.js.map