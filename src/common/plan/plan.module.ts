import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../subscription/subscription.entity';
import { PlanController } from './plan.controller';
import { Plan } from './plan.entity';
import { PlanService } from './plan.service';

@Module({
  controllers: [PlanController],
  exports: [PlanService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Plan, Subscription])],
  providers: [PlanService],
})
export class PlanModule {}
