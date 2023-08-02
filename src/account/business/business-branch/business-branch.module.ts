import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessBranchController } from './business-branch.controller';
import { BusinessBranch } from './business-branch.entity';
import { BusinessBranchService } from './business-branch.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessBranch])],
  providers: [BusinessBranchService],
  controllers: [BusinessBranchController],
  exports: [BusinessBranchService, TypeOrmModule],
})
export class BusinessBranchModule {}
