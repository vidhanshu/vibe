import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator';
import { MediaDto } from 'src/medias/dto/media.dto';

export class CreatePostDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(2500)
  content: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  medias: MediaDto[];
}
