import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Plan } from '../plan/plan.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;
  
  @Column({ default: true })
  status: boolean;
  
  @ManyToMany(() => Plan, plan => plan.permissions)
  plans: Plan[];
}
