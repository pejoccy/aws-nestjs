import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { FileModality, ShareOptions } from '../../common/interfaces';
import { File } from '../file/file.entity';
import { SessionToCollaborator } from './session-collaborator.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ enum: FileModality })
  modality: FileModality;

  @Column()
  accountId: number;

  @Column()
  creatorId: number;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @OneToMany(() => File, file => file.session)
  files: File[];

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'creatorId' })
  createdBy: Account;

  /*
    defined this prop to include permission field when FileToCollaborator entity is fetched
  */
  @OneToMany(
    () => SessionToCollaborator,
    sessionToCollaborator => sessionToCollaborator.session
  )
  public sessionToCollaborators!: SessionToCollaborator[];

  @ManyToMany(() => Account, account => account.collaboratedSessions)
  @JoinTable({ name: 'session_collaborator' })
  collaborators: Account[];
}
