import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/_entity';
import { Patient } from '../../patient/patient.entity';
import { BusinessBranch } from '../business-branch/business-branch.entity';
import { Business } from '../business.entity';

@Entity()
export class BusinessSessionBooking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  status: boolean;

  @Column()
  patientId: number;

  @Column()
  businessId: number;

  @Column()
  clinicalSummary: string;

  @Column()
  differentialDiagnosis: string;

  @Column()
  comment: string;

  @Column()
  referredBy: number;

  @Column()
  sessionId: number;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  referredToBizId?: number;

  @Column({ nullable: true })
  referredToBizBranchId?: number;

  @ManyToOne(() => Patient, (patient) => patient.bookings)
  patient: Patient;

  @ManyToOne(() => Business, (business) => business.bookings)
  business: Business;

  @ManyToOne(() => Business, (business) => business.referredBookings)
  referredToBiz: Business;

  @ManyToOne(() => BusinessBranch, (branch) => branch.bookings)
  referredToBizBranch: BusinessBranch;
}
