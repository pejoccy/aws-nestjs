import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreatePatientDto } from './create-patient-dto';

export class CreateBusinessPatientDto extends CreatePatientDto {
  @ApiHideProperty()
  @IsOptional()
  @IsInt()
  public businessId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  public registrationBranchId?: number;
}
