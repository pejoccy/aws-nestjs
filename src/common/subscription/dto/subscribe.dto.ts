import { Optional } from '@nestjs/common';
import { IsBoolean, IsUUID } from 'class-validator';

export class PlanSubscriptionDto {
  @IsUUID()
  planId: string;

  @IsBoolean()
  @Optional()
  isTrial?: boolean = false;
}
