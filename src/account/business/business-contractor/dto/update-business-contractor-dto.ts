import { PickType } from '@nestjs/swagger';
import { SetupBusinessContractorDto } from './setup-business-contractor-dto';

export class UpdateBusinessContractorDto extends PickType(
  SetupBusinessContractorDto,
  ['role', 'specializationId', 'countryId'],
) {}
