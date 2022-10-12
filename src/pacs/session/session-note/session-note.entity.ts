import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../../account/account.entity';
import { BaseEntity } from '../../../common/base/_entity';
import { Session } from '../session.entity';

@Entity()
export class SessionNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  sessionId: number;

  @Column()
  creatorId: number;

  @ManyToOne(() => Session, (session) => session.notes)
  session: Session;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'creatorId' })
  createdBy: Account;
}
