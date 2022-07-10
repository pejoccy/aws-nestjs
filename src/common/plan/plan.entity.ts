import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimeUnits } from '../interfaces';
import { Permission } from '../permission/permission.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
  
  @Column()
  currency: string;

  @Column({ nullable: true })
  ranking?: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: TimeUnits.MONTH })
  timeUnit: TimeUnits;

  @Column({ default: 1 })
  validity: number;

  @Column({ nullable: true })
  trialPeriod?: number;

  @Column({ nullable: true })
  trialTimeUnit?: TimeUnits;

  @Column({ default: true })
  status: boolean;
  
  @ManyToMany(() => Permission, permission => permission.plans)
  @JoinTable({ name: 'plan_permission' })
  permissions?: Permission[];
}
