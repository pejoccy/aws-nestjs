import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
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
  country?: string;

  @Column()
  dateOfBirth?: Date;

  @Column({ enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  accountId?: number;

  @OneToOne(() => Account)
  @JoinColumn()
  account?: Account;
}
