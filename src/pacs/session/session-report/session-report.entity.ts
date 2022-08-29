import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Specialist } from '../../../account/specialist/specialist.entity';
import { BaseEntity } from '../../../common/base/_entity';
import { Session } from '../session.entity';

@Entity()
export class SessionReport extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  report: Record<string, any>;

  @Column()
  sessionId: number;

  @Column()
  specialistId: number;

  @ManyToOne(() => Session, session => session.notes)
  session: Session;

  @ManyToOne(() => Specialist)
  @JoinColumn()
  specialist: Specialist;
}
