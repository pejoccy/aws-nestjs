import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessContactModule } from './business-contact/business-contact.module';
import { Business } from './business.entity';
import { BusinessBranchModule } from './business-branch/business-branch.module';

@Module({
  imports: [
    BusinessContactModule,
    BusinessBranchModule,
    TypeOrmModule.forFeature([Business]),
  ],
  providers: [BusinessService],
  controllers: [BusinessController],
  exports: [BusinessService, TypeOrmModule],
})
export class BusinessModule {}
