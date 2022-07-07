import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { ShareOptions } from '../../common/interfaces';
import { Session } from '../session/session.entity';
import { SessionToCollaborator } from '../session/session-collaborator.entity';
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
  accountId: number;

  @Column()
  folderId: number;

  @Column()
  creatorId: number;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @Column({ enum: FileStatus })
  status: FileStatus;

  @ManyToOne(() => Session, folder => folder.files)
  session: Session;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'creatorId' })
  createdBy: Account;
}
