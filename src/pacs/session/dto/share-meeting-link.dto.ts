import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class ShareSessionLinkDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  refreshToken?: boolean;
}
