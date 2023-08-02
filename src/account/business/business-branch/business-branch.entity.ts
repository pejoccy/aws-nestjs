import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Country } from '../../../common/country/country.entity';
import { Gender } from '../../../common/interfaces';
import { Account } from '../../account.entity';
import { Business } from '../../business/business.entity';

@Entity()
export class BusinessBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  public gender?: Gender;

  @Column()
  contactAddress: string;

  @Column({ nullable: true })
  countryId?: number;

  @Column()
  mobilePhone: string;

  @Column()
  accountId?: number;

  @Column()
  businessId: number;

  @ManyToOne(() => Business, (business) => business.contacts)
  business: Business;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;

  @ManyToOne(() => Country)
  @JoinColumn()
  country?: Country;
}
