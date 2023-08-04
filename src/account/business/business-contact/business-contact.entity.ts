import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Country } from '../../../common/country/country.entity';
import { Account } from '../../account.entity';
import { Business } from '../business.entity';
import { BusinessContactRoles, Gender } from 'src/common/interfaces';

@Entity()
export class BusinessContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  gender?: Gender;

  @Column()
  contactAddress: string;

  @Column({ nullable: true })
  countryId?: number;

  @Column()
  mobilePhone: string;

  @Column({ nullable: true, enum: BusinessContactRoles })
  role?: BusinessContactRoles;

  @Column()
  accountId?: number;

  @Column()
  businessId: number;

  @Column({ default: true })
  status?: boolean;

  @ManyToOne(() => Business, (business) => business.contacts)
  business: Business;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;

  @ManyToOne(() => Country)
  @JoinColumn()
  country?: Country;
}
