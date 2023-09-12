import { PartialType } from '@nestjs/swagger';
import { SetupBusinessContractorDto } from './setup-business-contractor-dto';

export class UpdateBusinessContractorDto extends PartialType(
  SetupBusinessContractorDto,
) {}
