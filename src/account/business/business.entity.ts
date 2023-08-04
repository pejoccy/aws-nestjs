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
import { BusinessBranch } from './business-branch/business-branch.entity';

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

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logoId?: number;

  @OneToMany(() => BusinessContact, (contact) => contact.business)
  contacts: BusinessContact[];

  @OneToMany(() => BusinessBranch, (branch) => branch.business)
  branches: BusinessBranch[];

  @ManyToMany(() => Account, (account) => account.business)
  @JoinTable({ name: 'business_contact' })
  accounts: Account[];

  @ManyToOne(() => Country)
  @JoinColumn()
  country?: Country;
}
