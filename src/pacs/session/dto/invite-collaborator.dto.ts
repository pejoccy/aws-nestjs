import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ResourcePermissions } from '../../../common/interfaces';

export class InviteCollaboratorDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(ResourcePermissions)
  @IsOptional()
  permission?: ResourcePermissions;
}
