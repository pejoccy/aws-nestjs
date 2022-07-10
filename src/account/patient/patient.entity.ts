import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Country } from '../../common/country/country.entity';
import { Gender } from '../../common/interfaces';
import { Account } from '../account.entity';
  
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
  countryId?: number;

  @Column()
  dateOfBirth?: Date;

  @Column({ enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  accountId?: number;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;

  @ManyToOne(() => Country)
  @JoinColumn()
  country?: Country;
}
