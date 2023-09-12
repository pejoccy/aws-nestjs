import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBusinessContactDto } from './create-business-contact-dto';

export class SetupBusinessContactDto extends CreateBusinessContactDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
