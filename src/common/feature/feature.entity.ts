import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeatureSlugs, FeatureUnits } from '../interfaces';
import { Plan } from '../plan/plan.entity';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ enum: FeatureSlugs })
  slug: FeatureSlugs;

  @Column({ enum: FeatureUnits })
  unit: FeatureUnits;
  
  @Column({ default: true })
  status: boolean;
  
  @ManyToMany(() => Plan, plan => plan.permissions)
  plans: Plan[];
}
