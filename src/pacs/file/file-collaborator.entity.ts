import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../../account/account.entity';
import { ResourcePermissions } from '../../common/interfaces';
import { File } from './file.entity';

@Entity()
export class FileToCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  collaboratorId: string;

  @Column({ type: 'uuid' })
  fileId: string;

  @Column({ enum: ResourcePermissions})
  permission: ResourcePermissions;

  @ManyToOne(() => File, file => file.fileToCollaborators)
  file: File;

  @ManyToOne(() => Account, collaborator => collaborator.fileToCollaborators)
  collaborator: Account;
}
