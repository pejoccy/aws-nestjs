import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialization } from '../../../common/specialization/specialization.entity';
import { BusinessContractorController } from './business-contractor.controller';
import { BusinessContractor } from './business-contractor.entity';
import { BusinessContractorService } from './business-contractor.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessContractor, Specialization])],
  providers: [BusinessContractorService],
  controllers: [BusinessContractorController],
  exports: [BusinessContractorService, TypeOrmModule],
})
export class BusinessContractorModule {}
