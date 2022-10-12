import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { Patient } from '../../account/patient/patient.entity';
import { FileModality, ShareOptions } from '../../common/interfaces';
import { Session } from '../session/session.entity';
import { FileStorageProviders, FileStatus } from './interface';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  ext?: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  mime?: string;

  @Column({ enum: FileStorageProviders })
  provider: FileStorageProviders;

  @Column({ nullable: true })
  hash?: string;

  @Column({ nullable: true })
  previewUrl?: string;

  @Column({ nullable: true })
  url?: string;

  @Column()
  patientId: number;

  @Column()
  sessionId: number;

  @Column()
  creatorId: number;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @Column({ enum: FileModality })
  modality: FileModality;

  @Column()
  modalitySection?: string;

  @Column({ enum: FileStatus })
  status: FileStatus;

  @ManyToOne(() => Session, (folder) => folder.files)
  session: Session;

  @OneToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'creatorId' })
  createdBy: Account;
}
