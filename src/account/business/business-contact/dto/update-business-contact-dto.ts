import { PartialType } from '@nestjs/swagger';
import { CreateBusinessContactDto } from './create-business-contact-dto';

export class UpdateBusinessContactDto extends PartialType(
  CreateBusinessContactDto,
) {}
