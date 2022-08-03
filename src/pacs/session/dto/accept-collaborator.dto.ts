import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptCollaboratorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  invitationId: string;
}
