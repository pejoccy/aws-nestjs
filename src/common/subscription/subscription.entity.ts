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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isTrial: boolean;

  @Column()
  planId: number;

  @Column({ nullable: true })
  paymentId: number;

  @Column()
  accountId: number;

  @Column({ default: true })
  recurring: boolean;

  @Column()
  billingStartDate: Date;

  @Column()
  nextBillingDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: true })
  status: boolean;

  @OneToOne(() => Plan)
  @JoinColumn()
  plan: Plan;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;
}
