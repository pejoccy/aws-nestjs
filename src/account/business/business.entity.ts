import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from '../../common/country/country.entity';
import { BusinessCategories } from '../../common/interfaces';
import { Account } from '../account.entity';
import { BusinessContact } from './business-contact/business-contact.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  email: string;

  @Column({ enum: BusinessCategories })
  category: BusinessCategories;

  @Column()
  contactAddress: string;

  @Column()
  countryId: number;

  @Column()
  mobilePhone: string;

  @Column()
  website: string;

  @Column()
  logoId: number;

  @OneToMany(() => BusinessContact, (contact) => contact.business)
  contacts: BusinessContact[];

  @ManyToMany(() => Account, (account) => account.business)
  @JoinTable({ name: 'business_contact' })
  accounts: Account[];

  @ManyToOne(() => Country)
  @JoinColumn()
  country?: Country;
}
