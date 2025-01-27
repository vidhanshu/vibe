import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class MediasService {
  private readonly s3Client: S3Client;
  private readonly bucketName = this.configService.get<string>('AWS_S3_BUCKET');
  private readonly region = this.configService.get<string>('AWS_REGION');
  private readonly accessKeyId =
    this.configService.get<string>('AWS_ACCESS_KEY')!;
  private readonly secretAccessKey =
    this.configService.get<string>('AWS_SECRET_KEY')!;
  private readonly baseS3Url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    const promises: Promise<any>[] = [];
    const mediaTypesAndIds: { type: string; id: string }[] = [];

    for (const file of files) {
      const folder = file.mimetype.startsWith('image') ? 'image' : 'video';
      const uuid = v4();
      const key = `${folder}s/${uuid}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype, // Ensures correct content type
      });

      promises.push(this.s3Client.send(command));
      mediaTypesAndIds.push({ type: folder.toUpperCase(), id: uuid });
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

  async deleteFiles(keys: string[]) {
    const promises: Promise<any>[] = [];

    for (const key of keys) {
      const command = new DeleteObjectCommand({
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
}
