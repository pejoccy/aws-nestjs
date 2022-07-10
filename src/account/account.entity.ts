import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UserRoles } from '../common/interfaces';
import { Subscription } from '../common/subscription/subscription.entity';
import { BusinessContact } from './business-contact/business-contact.entity';
import { Business } from './business/business.entity';
import { Patient } from './patient/patient.entity';
import { Specialist } from './specialist/specialist.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: true })
  password?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true, select: true })
  lastLoggedInAt?: Date;

  @Column({ nullable: true, select: true })
  lastLoginIp?: string;

  @Column({ nullable: true, enum: UserRoles })
  role?: UserRoles;

  @Column({ nullable: true, select: true })
  profilePhotoId?: number;

  @Column({ nullable: true })
  subscriptionId?: number;

  @OneToOne(() => BusinessContact, contact => contact.account)
  businessContact: BusinessContact;

  @ManyToMany(() => Business, business => business.accounts)
  @JoinTable({ name: 'business_contact' })
  business: Business[];

  @OneToOne(() => Patient, patient => patient.account)
  patient: Patient;

  @OneToOne(() => Subscription, subscription => subscription.account)
  @JoinColumn()
  subscription?: Subscription;
  
  @OneToOne(() => Specialist, specialist => specialist.account)
  specialist?: Specialist;
}
