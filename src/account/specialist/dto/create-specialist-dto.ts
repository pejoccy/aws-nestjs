import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { SpecialistCategories } from '../../../common/interfaces';

export class CreateSpecialistDto {
  @ApiProperty({ enum: SpecialistCategories })
  @IsEnum(SpecialistCategories)
  public category: SpecialistCategories;

  @ApiPropertyOptional()
  @IsUUID()
  @ValidateIf((obj, val) => !!val || !obj.otherSpecialization)
  public specializationId?: string;
  
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((obj, val) => !!val || !obj.specializationId)
  public otherSpecialization?: string;
}
