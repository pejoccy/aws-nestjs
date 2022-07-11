import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Account } from '../../account/account.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { GetAccount } from '../decorators/get-user-decorator';
import { ResourcePermission } from '../decorators/permission.decorator';
import { ResourcePermissions } from '../interfaces';
import { PlanSubscriptionDto } from './dto/subscribe.dto';
import { SubscriptionService } from './subscription.service';

@ApiBearerAuth()
@ApiTags('Subscription')
@Controller('subscriptions')
@UseGuards(RolesGuard, PermissionGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('/subscribe')
  @ResourcePermission(ResourcePermissions.ADD_MULTIPLE_PAYMENT_CARDS)
  async subscribe(
    @Body() item: PlanSubscriptionDto,
    @GetAccount() account: Account
  ) {
    return this.subscriptionService.subscribe(item, account);
  }

  @Get('/info')
  async getSubscription(@GetAccount() account: Account) {
    return account.subscription;
  }
}
