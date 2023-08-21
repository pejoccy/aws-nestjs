import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBusinessPatientDto } from './create-business-patient-dto';

export class UpdateBusinessPatientDto extends PartialType(
  OmitType(CreateBusinessPatientDto, ['businessId']),
) {}
