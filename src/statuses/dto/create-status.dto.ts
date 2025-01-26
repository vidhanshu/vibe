import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MediaDto } from 'src/medias/dto/media.dto';

export class CreateStatusDto {
  @IsString()
  @ValidateIf((dto) => !dto.medias || dto.medias.length === 0)
  message: string;

  @IsString()
  @ValidateIf((dto) => !dto.medias || dto.medias.length === 0)
  backgroundColor: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  medias: MediaDto[];
}
