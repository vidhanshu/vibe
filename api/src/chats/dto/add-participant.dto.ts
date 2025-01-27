import { IsUUID } from 'class-validator';

export class AddParticipantDto {
  @IsUUID()
  participantId: string;
}
