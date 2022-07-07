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
import { File } from '../pacs/file/file.entity';
import {
  SessionToCollaborator,
} from '../pacs/session/session-collaborator.entity';
import { Session } from '../pacs/session/session.entity';
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
  profilePhotoId?: string;

  @OneToOne(() => File)
  @JoinColumn()
  profilePhoto?: File;

  @Column({ nullable: true })
  subscriptionId?: number;

  @OneToOne(() => Subscription, subscription => subscription.account)
  @JoinColumn()
  subscription?: Subscription;
  
  @OneToOne(() => Specialist, specialist => specialist.account)
  specialist?: Specialist;

  @OneToMany(
    () => SessionToCollaborator,
    fileToCollaborator => fileToCollaborator.collaborator
  )
  public sessionToCollaborators!: Promise<SessionToCollaborator[]>;

  @ManyToMany(() => Session, session => session.collaborators)
  @JoinTable({ name: 'session_collaborator' })
  collaboratedSessions: Session[];
}
