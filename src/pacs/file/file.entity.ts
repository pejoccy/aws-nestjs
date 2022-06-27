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
import { Folder } from '../folder/folder.entity';
import { FileToCollaborator } from './file-collaborator.entity';
import { FileStatus } from './interface';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  resourceId?: string;

  @Column({ nullable: true })
  resourceUri?: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid' })
  folderId: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @Column({ enum: FileStatus })
  status: FileStatus;

  @ManyToOne(() => Folder, folder => folder.files)
  folder: Folder;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'createdBy' })
  owner: Account;

  /*
    defined this prop to include permission field when FileToCollaborator entity is fetched
  */
  @OneToMany(
    () => FileToCollaborator,
    fileToCollaborator => fileToCollaborator.file
  )
  public fileToCollaborators!: FileToCollaborator[];

  @ManyToMany(() => Account, account => account.collaboratedFiles)
  @JoinTable({ name: 'file_collaborator' })
  collaborators: Account[];
}
