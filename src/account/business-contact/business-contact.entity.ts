import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Account } from '../account.entity';
import { Business } from '../business/business.entity';

@Entity()
export class BusinessContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  email: string;

  @Column()
  contactAddress: string;

  @Column()
  mobilePhone: string;  

  @Column()
  website: string;

  @Column()
  accountId: number;

  @Column()
  businessId: number;

  @OneToMany(() => Business, business => business.contacts)
  business: Business;

  @OneToOne(() => Account)
  account: Account;
}
