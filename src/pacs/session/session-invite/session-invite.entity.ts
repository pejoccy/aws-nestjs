import { Account } from '../../../account/account.entity';
import { BaseEntity } from '../../../common/base/_entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InviteStatus, ResourcePermissions } from '../../../common/interfaces';
import { Session } from '../session.entity';

@Entity()
export class SessionInvite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inviteeEmail: string;

  @Column()
  token: string;

  @Column()
  sessionId: number;

  @Column()
  invitedBy: number;

  @Column({
    enum: ResourcePermissions,
    default: ResourcePermissions.READ_WRITE,
  })
  permission: ResourcePermissions;

  @Column({
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @Column()
  expiresAt: Date;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'invitedBy' })
  createdBy?: Account;

  @ManyToOne(() => Session, (session) => session.invitations)
  session: Session;
}
