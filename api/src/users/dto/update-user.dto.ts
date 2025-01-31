import { AnyOf } from 'src/common/pipes/any-of.pipe';

import { Type } from 'class-transformer';
import { IsIn, IsString, IsOptional } from 'class-validator';
import { MediaDto } from 'src/medias/dto/media.dto';

@AnyOf(['bio', 'gender', 'pronoun', 'profilePhoto'])
export class UpdateUserDto {
  @Type(() => MediaDto)
  @IsOptional()
  profilePhoto: MediaDto;

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
