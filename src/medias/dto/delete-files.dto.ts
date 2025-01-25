import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeleteFileDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  keys: string[];
}
