import { PartialType } from '@nestjs/swagger';
import { CreateBusinessBookingDto } from './create-business-booking-dto';

export class UpdateBusinessBookingDto extends PartialType(
  CreateBusinessBookingDto,
) {}
