import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/_entity';
import { BusinessContractorRoles } from '../../../common/interfaces';
import { Specialization } from '../../../common/specialization/specialization.entity';
import { Specialist } from '../../specialist/specialist.entity';
import { BusinessSessionBooking } from '../business-session-booking/business-session-booking.entity';
import { Business } from '../business.entity';

@Entity()
export class BusinessContractor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  specialistId: number;

  @Column()
  specializationId: number;

  @Column({ enum: BusinessContractorRoles })
  role: BusinessContractorRoles;

  @Column({ default: true })
  status: boolean;

  @Column()
  businessId: number;

  @ManyToOne(() => Business, (business) => business.contractors)
  business: Business;

  @ManyToOne(() => Specialist, (specialist) => specialist.contractors)
  specialist: Specialist;

  @ManyToOne(
    () => Specialization,
    (specialization) => specialization.contractors,
  )
  specialization: Specialization;
  
  @OneToMany(() => BusinessSessionBooking, (booking) => booking.assignedTo)
  public assignedBookings: BusinessSessionBooking[];
}
