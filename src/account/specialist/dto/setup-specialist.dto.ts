import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSpecialistDto } from './create-specialist-dto';

export class SetupSpecialistDto extends OmitType(CreateSpecialistDto, ['email'] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
