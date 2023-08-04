import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { State } from '../../../common/state/state.entity';
import { Business } from '../../business/business.entity';

@Entity()
export class BusinessBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  stateId?: number;

  @Column()
  city: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true })
  status: boolean;

  @Column()
  businessId: number;

  @ManyToOne(() => Business, (business) => business.branches)
  business: Business;

  @ManyToOne(() => State)
  @JoinColumn()
  state?: State;
}
