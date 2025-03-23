import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateChatDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(800)
  description?: string;
}
