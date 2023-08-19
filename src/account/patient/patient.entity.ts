import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Country } from '../../common/country/country.entity';
import { Gender } from '../../common/interfaces';
import { State } from '../../common/state/state.entity';
import { Account } from '../account.entity';
import { Business } from '../business/business.entity';
import { BusinessSessionBooking } from '../business/business-session-booking/business-session-booking.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  mobilePhone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  weight?: number;

  @Column()
  height?: number;

  @Column()
  countryId?: number;

  @Column({ nullable: true })
  stateId?: number;

  @Column({ nullable: true })
  city?: string;

  @Column()
  dateOfBirth?: Date;

  @Column({ enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  accountId?: number;

  @Column({ nullable: true })
  businessId?: number;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;

  @OneToOne(() => Business)
  @JoinColumn()
  business?: Business;

  @OneToMany(() => BusinessSessionBooking, (booking) => booking.patient)
  bookings?: BusinessSessionBooking[];

  @ManyToOne(() => Country)
  @JoinColumn()
  country?: Country;

  @ManyToOne(() => State)
  @JoinColumn()
  state?: State;
}
