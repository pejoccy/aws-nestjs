import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { SetupBusinessContractorDto } from './setup-business-contractor-dto';

export class UpdateBusinessContractorDto extends PickType(
  SetupBusinessContractorDto,
  ['role', 'specializationId', 'countryId'],
) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
