import { Optional } from '@nestjs/common';
import { IsBoolean, IsInt, IsUUID } from 'class-validator';

export class PlanSubscriptionDto {
  @IsInt()
  planId: number;

  @IsBoolean()
  @Optional()
  isTrial?: boolean = false;
}
