import { IsString, IsEnum, IsUrl, Matches } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class MediaDto {
  @Matches(/^(https?:\/\/)?[a-zA-Z0-9.-]+\.s3\.[a-zA-Z0-9.-]+\/.+$/, {
    message: 'URL must be a valid AWS S3 URL',
  })
  url: string;

  @IsString()
  key: string;

  @IsEnum(MediaType, { message: 'mediaType must be either "image" or "video"' })
  mediaType: MediaType;
}
