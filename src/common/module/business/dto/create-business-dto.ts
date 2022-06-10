import {
  IsBase64,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;
  
  @IsNotEmpty()
  @IsString()
  contactAddress: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsBase64()
  logo?: string;
}
