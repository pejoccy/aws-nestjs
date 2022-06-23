import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserRoles } from '../common/interfaces';
import { Business } from './business/business.entity';
import { Specialist } from './specialist/specialist.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: true })
  password?: string;

  @Column({ nullable: true, select: true })
  lastLoggedInAt?: Date;

  @Column({ nullable: true, select: true })
  lastLoginIp?: string;

  @Column({ nullable: true, enum: UserRoles })
  role?: UserRoles;

  @Column({ nullable: true })
  businessId?: string;

  @OneToOne(() => Business)
  @JoinColumn()
  business?: Business;

  @OneToOne(() => Specialist, specialist => specialist.account)
  specialist?: Specialist;
}
