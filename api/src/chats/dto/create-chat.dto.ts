import { ChatType } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateChatDto {
  @IsEnum(ChatType, { message: 'Should be either DM or GROUP' })
  chatType: 'DM' | 'GROUP';

  @IsString()
  @ValidateIf((obj) => obj.chatType === 'GROUP')
  name: string;

  @IsString()
  @IsOptional()
  @ValidateIf((obj) => obj.chatType === 'GROUP')
  description: string;

  @IsUUID()
  @ValidateIf((obj) => obj.chatType === 'DM')
  participantId: string;

  @IsArray()
  @ValidateIf((obj) => obj.chatType === 'GROUP')
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  participantIds: string[];
}
