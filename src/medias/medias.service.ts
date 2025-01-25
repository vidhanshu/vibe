import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class MediasService {
  private awsS3: S3;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.awsS3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') as string;
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    const promises: Promise<any>[] = [];
    const mediaTypes: string[] = [];

    for (const file of files) {
      const folder = file.mimetype.startsWith('image') ? 'image' : 'video';
      const params = {
        Bucket: this.bucketName,
        Key: `${folder}s/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
      };
      promises.push(this.awsS3.upload(params).promise());
      mediaTypes.push(folder);
    }
    const response = await Promise.all(promises);

    return response.map(({ Key, Location }, idx) => ({
      key: Key,
      url: Location,
      mediaType: mediaTypes[idx],
    }));
  }

  async deleteFiles(keys: string[]) {
    const promises: Promise<any>[] = [];
    for (const key of keys) {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };
      promises.push(this.awsS3.deleteObject(params).promise());
    }

    // also delete from db
    await Promise.all(promises);

    return {
      statusCode: 200,
      message: 'Files deleted successfully',
    };
  }
}
