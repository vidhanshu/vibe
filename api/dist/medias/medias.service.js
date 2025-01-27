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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
let MediasService = class MediasService {
    constructor(configService) {
        this.configService = configService;
        this.bucketName = this.configService.get('AWS_S3_BUCKET');
        this.region = this.configService.get('AWS_REGION');
        this.accessKeyId = this.configService.get('AWS_ACCESS_KEY');
        this.secretAccessKey = this.configService.get('AWS_SECRET_KEY');
        this.baseS3Url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });
    }
    async uploadFiles(files) {
        const promises = [];
        const mediaTypesAndIds = [];
        for (const file of files) {
            const folder = file.mimetype.startsWith('image') ? 'image' : 'video';
            const uuid = (0, uuid_1.v4)();
            const key = `${folder}s/${uuid}-${file.originalname}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            promises.push(this.s3Client.send(command));
            mediaTypesAndIds.push({ type: folder, id: uuid });
        }
        const responses = await Promise.all(promises);
        return responses.map((_, idx) => {
            const { id, type } = mediaTypesAndIds[idx];
            return {
                key: `${type}s/${id}-${files[idx].originalname}`,
                url: `${this.baseS3Url}/${type}s/${id}-${files[idx].originalname}`,
                mediaType: type,
            };
        });
    }
    async deleteFiles(keys) {
        const promises = [];
        for (const key of keys) {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            promises.push(this.s3Client.send(command));
        }
        await Promise.all(promises);
        return {
            statusCode: 200,
            message: 'Files deleted successfully',
        };
    }
};
exports.MediasService = MediasService;
exports.MediasService = MediasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MediasService);
//# sourceMappingURL=medias.service.js.map