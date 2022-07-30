import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { ResourcePermissions } from '../interfaces';
import { Plan } from '../plan/plan.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: ResourcePermissions;
  
  @Column({ default: true })
  status: boolean;
  
  @ManyToMany(() => Plan, plan => plan.permissions)
  plans: Plan[];
}
