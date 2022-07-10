import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBusinessDto } from './create-business-dto';

export class SetupBusinessDto extends CreateBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
