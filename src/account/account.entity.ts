import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from '../common/interfaces';
import { Subscription } from '../common/subscription/subscription.entity';
import { Business } from './business/business.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: true })
  password?: string;

  @Column({ nullable: true, select: true })
  lastLoggedInAt?: Date;

  @Column({ nullable: true, select: true })
  lastLoginIp?: string;

  @Column({ nullable: true, enum: UserRole })
  role?: UserRole;

  @Column({ type: 'uuid', nullable: true })
  businessId?: string;

  @Column({ type: 'uuid', nullable: true })
  subscriptionId?: string;

  @OneToOne(() => Business)
  @JoinColumn()
  business?: Business;

  @OneToOne(() => Subscription)
  @JoinColumn()
  subscription?: Subscription;
}
