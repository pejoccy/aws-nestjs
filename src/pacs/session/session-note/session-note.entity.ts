import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../../../account/account.entity';
import { Session } from '../session.entity';

@Entity()
export class SessionNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  sessionId: number;

  @Column()
  creatorId: number;

  @ManyToOne(() => Session, session => session.notes)
  session: Session;

  @ManyToOne(() => Account)
  createdBy: Account;
}
