import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessSessionBookingController } from './business-session-booking.controller';
import { BusinessSessionBooking } from './business-session-booking.entity';
import { BusinessSessionBookingService } from './business-session-booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessSessionBooking])],
  providers: [BusinessSessionBookingService],
  controllers: [BusinessSessionBookingController],
  exports: [BusinessSessionBookingService, TypeOrmModule],
})
export class BusinessSessionBookingModule {}
