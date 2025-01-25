import { IsString, IsEnum, IsUrl } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class MediaDto {
  @IsUrl()
  url: string;

  @IsString()
  key: string;

  @IsEnum(MediaType, { message: 'mediaType must be either "image" or "video"' })
  mediaType: MediaType;
}
