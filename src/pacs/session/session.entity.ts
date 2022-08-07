import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { Patient } from '../../account/patient/patient.entity';
import { BaseEntity } from '../../common/base/_entity';
import { FileModality, ShareOptions } from '../../common/interfaces';
import { File } from '../file/file.entity';
import { SessionToCollaborator } from './session-collaborator/session-collaborator.entity';
import { SessionNote } from './session-note/session-note.entity';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  studyDate?: string;

  @Column()
  studyInfo?: string;

  @Column({ enum: FileModality })
  modality: FileModality;

  @Column()
  creatorId: number;

  @Column()
  patientId?: number;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @OneToMany(() => File, file => file.session)
  files: File[];

  @OneToMany(() => SessionNote, note => note.session)
  notes: SessionNote[];

  @OneToOne(() => Account)
  @JoinColumn({ name: 'creatorId' })
  createdBy: Account;

  @OneToOne(() => Patient)
  @JoinColumn()
  patient?: Patient;

  @ManyToMany(() => Account, account => account.collaboratedSessions)
  collaborators: Account[];

  /*
    defined this prop to include permission field when FileToCollaborator entity is fetched
  */
  @OneToMany(
    () => SessionToCollaborator,
    sessionToCollaborator => sessionToCollaborator.session
  )
  public sessionToCollaborators!: SessionToCollaborator[];
}
