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
import { CommsProviders, FileModality, ShareOptions } from '../../common/interfaces';
import { File } from '../file/file.entity';
import { SessionToCollaborator } from './session-collaborator/session-collaborator.entity';
import { SessionNote } from './session-note/session-note.entity';
import { ReportTemplate } from '../report-template/report-template.entity';
import { SessionReport } from './session-report/session-report.entity';

export interface SessionComms {
  [CommsProviders.AWS_CHIME]: {
    chatChannelArn: string;
    meetChannelArn: string;
  },
}

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
  reportTemplateId?: number;

  @Column()
  creatorId: number;

  @Column()
  patientId?: number;

  @Column()
  comms?: SessionComms;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @OneToMany(() => File, file => file.session)
  files: File[];

  @OneToMany(() => SessionNote, note => note.session)
  notes: SessionNote[];

  @OneToMany(() => SessionReport, report => report.session)
  reports: SessionReport[];

  @OneToOne(() => Account)
  @JoinColumn({ name: 'creatorId' })
  createdBy: Account;

  @OneToOne(() => ReportTemplate)
  @JoinColumn()
  reportTemplate?: ReportTemplate;

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
