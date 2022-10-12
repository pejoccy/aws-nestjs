import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimeUnits } from '../interfaces';
import { Feature } from '../feature/feature.entity';

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

  @ManyToMany(() => Feature, (feature) => feature.plans)
  @JoinTable({ name: 'plan_feature' })
  permissions?: Feature[];
}
