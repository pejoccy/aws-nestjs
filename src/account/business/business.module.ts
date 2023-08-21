import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientModule } from '../patient/patient.module';
import { BusinessBranchModule } from './business-branch/business-branch.module';
import { BusinessContactModule } from './business-contact/business-contact.module';
import { BusinessController } from './business.controller';
import { Business } from './business.entity';
import { BusinessService } from './business.service';
import { BusinessSessionBookingModule } from './business-session-booking/business-session-booking.module';
import { BusinessContractorModule } from './business-contractor/business-contractor.module';

@Module({
  imports: [
    BusinessContactModule,
    BusinessContractorModule,
    BusinessBranchModule,
    BusinessSessionBookingModule,
    PatientModule,
    TypeOrmModule.forFeature([Business]),
  ],
  providers: [BusinessService],
  controllers: [BusinessController],
  exports: [BusinessService, TypeOrmModule],
})
export class BusinessModule {}
