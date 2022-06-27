import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { FileModality, ShareOptions } from '../../common/interfaces';
import { File } from '../file/file.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ enum: FileModality })
  modality: FileModality;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'enum', enum: ShareOptions, default: ShareOptions.PRIVATE })
  sharing: ShareOptions;

  @OneToMany(() => File, file => file.folder)
  files: File[];

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToOne(() => Account)
  @JoinColumn({ name: 'createdBy' })
  owner: Account;
}
