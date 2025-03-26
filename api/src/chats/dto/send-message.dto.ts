import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
  ValidateIf,
  MinLength,
  IsUUID,
} from 'class-validator';
import { MediaDto } from 'src/medias/dto/media.dto';

export class SendMessageDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  message: string;

  @Type(() => MediaDto)
  @ValidateNested()
  @IsOptional()
  media: MediaDto;

  @IsUUID()
  @IsOptional()
  repliedMessageId: string;

  @IsUUID()
  @IsOptional()
  statusId: string;
}
