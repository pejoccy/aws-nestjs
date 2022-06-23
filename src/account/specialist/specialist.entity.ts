import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SpecialistCategories } from '../../common/interfaces';
import { 
  Specialization,
} from '../../common/specialization/specialization.entity';
import { Account } from '../account.entity';
  
@Entity()
export class Specialist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid' })
  specializationId: string;

  @Column({ enum: SpecialistCategories })
  category: SpecialistCategories;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;

}
