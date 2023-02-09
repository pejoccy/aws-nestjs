import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../../../account/account.entity';
import { ResourcePermissions } from '../../../common/interfaces';
import { Session } from '../session.entity';

@Entity({ name: 'session_collaborator' })
export class SessionToCollaborator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

  @Column()
  sessionId: number;

  @Column({ nullable: true })
  expiresAt?: Date;

  // @Column({ nullable: true, default: true })
  // status?: boolean;

  @Column({
    enum: ResourcePermissions,
    default: ResourcePermissions.READ_WRITE,
  })
  permission: ResourcePermissions;

  @ManyToOne(() => Session, (session) => session.sessionToCollaborators)
  session: Session;

  @ManyToOne(
    () => Account,
    (collaborator) => collaborator.sessionToCollaborators,
  )
  account: Account;
}
