import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { PlanModule } from '../plan/plan.module';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
  imports: [PlanModule, TypeOrmModule.forFeature([Subscription])],
  providers: [SubscriptionService, PermissionGuard],
})
export class SubscriptionModule {}
