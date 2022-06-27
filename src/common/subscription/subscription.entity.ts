import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { Plan } from '../plan/plan.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isTrial: boolean;

  @Column({ type: 'uuid' })
  planId: string;

  @Column({ type: 'uuid' })
  paymentId: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ default: true })
  recurring: boolean;

  @Column()
  billingStartDate: Date;

  @Column()
  nextBillingDate: Date;

  @Column({ default: true })
  status: boolean;

  @OneToOne(() => Plan)
  @JoinColumn()
  plan: Plan;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;
}
