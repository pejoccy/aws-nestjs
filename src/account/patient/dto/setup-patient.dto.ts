import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePatientDto } from './create-patient-dto';

export class SetupPatientDto extends OmitType(CreatePatientDto, ['email', 'accountId'] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
