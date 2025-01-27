import { ConfigService } from '@nestjs/config';
export declare class MediasService {
    private configService;
    private readonly s3Client;
    private readonly bucketName;
    private readonly region;
    private readonly accessKeyId;
    private readonly secretAccessKey;
    private readonly baseS3Url;
    constructor(configService: ConfigService);
    uploadFiles(files: Array<Express.Multer.File>): Promise<{
        key: string;
        url: string;
        mediaType: string;
    }[]>;
    deleteFiles(keys: string[]): Promise<{
        statusCode: number;
        message: string;
    }>;
}
