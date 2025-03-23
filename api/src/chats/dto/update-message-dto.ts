import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(1)
  message: string;
}
