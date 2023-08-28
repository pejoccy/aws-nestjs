import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Country } from '../../../common/country/country.entity';
import { State } from '../../../common/state/state.entity';
import { Business } from '../../business/business.entity';
import { BusinessSessionBooking } from '../business-session-booking/business-session-booking.entity';

@Entity()
export class BusinessBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  countryId: number;

  @Column()
  stateId: number;

  @Column()
  city: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true })
  status: boolean;

  @Column()
  businessId: number;

  @ManyToOne(() => Business, (business) => business.branches)
  business: Business;

  @ManyToOne(() => Country, (country) => country.businesses)
  country: Country;

  @ManyToOne(() => State)
  @JoinColumn()
  state?: State;

  @OneToMany(
    () => BusinessSessionBooking,
    (booking) => booking.referredToBizBranch,
  )
  bookings?: BusinessSessionBooking[];
}
