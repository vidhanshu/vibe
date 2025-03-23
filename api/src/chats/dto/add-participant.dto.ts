import { ArrayMinSize, IsUUID } from 'class-validator';

export class AddParticipantDto {
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  participantIds: string[];
}
