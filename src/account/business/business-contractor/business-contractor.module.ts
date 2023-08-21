import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessContractorController } from './business-contractor.controller';
import { BusinessContractor } from './business-contractor.entity';
import { BusinessContractorService } from './business-contractor.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessContractor])],
  providers: [BusinessContractorService],
  controllers: [BusinessContractorController],
  exports: [BusinessContractorService, TypeOrmModule],
})
export class BusinessContractorModule {}
