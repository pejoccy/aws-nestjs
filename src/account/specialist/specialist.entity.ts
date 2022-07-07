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
import { Business } from '../business/business.entity';
  
@Entity()
export class Specialist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  mobilePhone: string;

  @Column({ nullable: true })
  businessId?: number;

  @Column()
  accountId: number;

  @Column()
  specializationId: number;

  @Column({ enum: SpecialistCategories })
  category: SpecialistCategories;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;

  @OneToOne(() => Business)
  @JoinColumn()
  business?: Business;
}
