import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessSessionBookingController } from './business-session-booking.controller';
import { BusinessSessionBooking } from './business-session-booking.entity';
import { BusinessSessionBookingService } from './business-session-booking.service';
import { BusinessContractor } from '../business-contractor/business-contractor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessContractor, BusinessSessionBooking]),
  ],
  providers: [BusinessSessionBookingService],
  controllers: [BusinessSessionBookingController],
  exports: [BusinessSessionBookingService, TypeOrmModule],
})
export class BusinessSessionBookingModule {}
