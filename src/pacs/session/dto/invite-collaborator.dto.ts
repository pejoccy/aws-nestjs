import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InviteCollaboratorDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
