import { MediaType } from '@prisma/client';
import { IsString, IsEnum, Matches } from 'class-validator';

export class MediaDto {
  @Matches(/^(https?:\/\/)?[a-zA-Z0-9.-]+\.s3\.[a-zA-Z0-9.-]+\/.+$/, {
    message: 'URL must be a valid AWS S3 URL',
  })
  url: string;

  @IsString()
  key: string;

  @IsEnum(MediaType, { message: 'mediaType must be either "IMAGE" or "VIDEO"' })
  mediaType: MediaType;
}
