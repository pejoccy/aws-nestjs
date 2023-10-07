import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Gender, SpecialistCategories } from '../../common/interfaces';
import { Specialization } from '../../common/specialization/specialization.entity';
import { Account } from '../account.entity';
import { BusinessContractor } from '../business/business-contractor/business-contractor.entity';
import { BusinessSessionBooking } from '../business/business-session-booking/business-session-booking.entity';

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
  gender?: Gender;

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

  @OneToMany(() => BusinessContractor, (contractor) => contractor.specialist)
  contractors: BusinessContractor[];

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Specialization)
  @JoinColumn()
  specialization: Specialization;
  
  @OneToMany(() => BusinessSessionBooking, (booking) => booking.assignedTo)
  public assignedBookings!: BusinessSessionBooking;

}
