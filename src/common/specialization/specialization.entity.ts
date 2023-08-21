import { BusinessContractor } from 'src/account/business/business-contractor/business-contractor.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column({ default: true, select: false })
  status: boolean;

  @Column({ default: false })
  isAnonymous: boolean;

  @OneToMany(
    () => BusinessContractor,
    (contractor) => contractor.specialization,
  )
  contractors: BusinessContractor[];
}
