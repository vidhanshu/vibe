import { Type } from 'class-transformer';
import {
  IsIn,
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { MediaDto } from 'src/medias/dto/media.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Type(() => MediaDto)
  @IsOptional()
  profilePhoto: MediaDto;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  @IsIn(['male', 'female', 'other', 'prefer_not_to_say'])
  gender: string;

  @IsString()
  @IsOptional()
  @IsIn(['he', 'she', 'they'])
  pronoun: string;
}
