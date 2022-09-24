import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class PlanFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  planId: number;
  
  @Column()
  featureId: string;

  @Column()
  accountType: string;

  @Column()
  limit: string;

  @Column({ default: true })
  status: boolean;
}
