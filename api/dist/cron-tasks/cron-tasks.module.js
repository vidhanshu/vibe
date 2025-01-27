"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronTasksModule = void 0;
const common_1 = require("@nestjs/common");
const cron_tasks_service_1 = require("./cron-tasks.service");
const cron_tasks_controller_1 = require("./cron-tasks.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const medias_service_1 = require("../medias/medias.service");
let CronTasksModule = class CronTasksModule {
};
exports.CronTasksModule = CronTasksModule;
exports.CronTasksModule = CronTasksModule = __decorate([
    (0, common_1.Module)({
        controllers: [cron_tasks_controller_1.CronTasksController],
        providers: [cron_tasks_service_1.CronTasksService, prisma_service_1.PrismaService, medias_service_1.MediasService],
    })
], CronTasksModule);
//# sourceMappingURL=cron-tasks.module.js.map