import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { BusinessContractorRoles } from '../../../../common/interfaces';

export class SetupBusinessContractorDto {
  @ApiPropertyOptional({ description: 'Required if accountId is not set' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((obj, val) => !!val || !obj.accountId)
  firstName: string;

  @ApiPropertyOptional({ description: 'Required if accountId is not set' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((obj, val) => !!val || !obj.accountId)
  lastName: string;

  @ApiPropertyOptional({ description: 'Required if accountId is not set' })
  @IsEmail()
  @ValidateIf((obj, val) => !!val || !obj.accountId)
  email: string;

  @ApiPropertyOptional({ description: 'Required if accountId is not set' })
  @IsMobilePhone()
  @ValidateIf((obj, val) => !!val || !obj.accountId)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  qualification: string;

  @ApiProperty({ enum: BusinessContractorRoles })
  @IsEnum(BusinessContractorRoles)
  role: BusinessContractorRoles;

  @ApiProperty()
  @IsNumber()
  specializationId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  countryId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  accountId?: number;
}
