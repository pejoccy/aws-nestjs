import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base/_entity';
import { ActivityType } from '../../interface';

@Entity()
export class MeetActivity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  meetId: string;

  @Column()
  attendeeId: string;

  @Column()
  type: ActivityType;

  @Column()
  activityDate?: Date;
}
