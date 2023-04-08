import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Gender, SpecialistCategories } from '../../common/interfaces';
import { Specialization } from '../../common/specialization/specialization.entity';
import { Account } from '../account.entity';

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

  @Column({ nullable: true })
  public gender?: Gender;

  @Column()
  mobilePhone: string;

  @Column()
  accountId: number;

  @Column({ nullable: true })
  countryId?: number;

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
}
