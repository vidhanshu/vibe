import { ChatGroupRole } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsUUID } from 'class-validator';

export class UpdateParticipantDto {
  @IsEnum(ChatGroupRole, { message: 'Should be either ADMIN or MEMBER' })
  role: 'ADMIN' | 'MEMBER';
}
