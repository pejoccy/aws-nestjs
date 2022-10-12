import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Account } from '../../account/account.entity';
import { TimeUnits } from '../interfaces';
import { Plan } from '../plan/plan.entity';
import { PlanSubscriptionDto } from './dto/subscribe.dto';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private configService: ConfigService,
  ) {}

  public async subscribe(
    { planId, isTrial }: PlanSubscriptionDto,
    account: Account,
  ) {
    const plan = await this.planRepository.findOne(planId);
    if (!plan) {
      throw new NotFoundException('Invalid plan id!');
    }
    if (isTrial) {
      await this.validateMultipleTrialSubscription(account, plan);
    }
    // find account latest subscription, where nextBilling is greater than today
    const subscription = await this.subscriptionRepository.findOne({
      where: { accountId: account.id },
      order: { nextBillingDate: -1 },
    });

    return this.finalizeSubscription(plan, account, subscription);
  }

  public async setupDefaultSubscription(account: Account) {
    const plan = await this.planRepository.findOne({
      where: { isDefault: true },
    });
    if (!plan) {
      throw new NotFoundException('Invalid plan id!');
    }

    return this.finalizeSubscription(plan, account);
  }

  private async finalizeSubscription(
    plan: Plan,
    account: Account,
    subscription?: Subscription,
    payment?: any,
  ) {
    let billingStartDate = new Date();
    if (
      !!subscription &&
      moment().diff(moment(subscription.nextBillingDate)) > 0
    ) {
      billingStartDate = subscription.nextBillingDate;
    }
    if (!payment && !plan.isDefault && !plan.trialPeriod) {
      throw new NotAcceptableException(
        'Plan does not support trial subscription!',
      );
    }
    const nextBillingDate = !plan.isDefault
      ? this.getNextBillingDate(
          payment ? plan.timeUnit : plan.trialTimeUnit,
          payment ? plan.validity : plan.trialPeriod,
          billingStartDate,
        )
      : undefined;

    ({
      raw: [subscription],
    } = await this.subscriptionRepository
      .createQueryBuilder()
      .insert()
      .values({
        billingStartDate,
        nextBillingDate,
        plan,
        account,
        recurring: !plan.isDefault,
      })
      .returning('*')
      .execute());

    // update user entity
    // await this.accountRepository.update(
    //   { id: account.id },
    //   { subscriptionId: subscription.id },
    // );

    return subscription;
  }

  private async validateMultipleTrialSubscription(
    account: Account,
    plan: Plan,
  ) {
    const multiplePlanTrials = this.configService.get(
      'app.settings.multipleTrialSubscription',
      false,
    );

    const subscription = await this.subscriptionRepository.findOne({
      where: { accountId: account.id, planId: plan.id },
    });
    if (!multiplePlanTrials && subscription) {
      throw new NotAcceptableException(
        'Multiple trial plan subscription not allowed!',
      );
    }
  }

  private getNextBillingDate(
    timeUnit: TimeUnits,
    validity: number,
    billingStartDate: Date,
  ): Date {
    return moment(billingStartDate).add(validity, timeUnit).toDate();
  }
}
