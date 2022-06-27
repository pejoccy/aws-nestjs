import { FileToCollaborator } from 'src/pacs/file/file-collaborator.entity';
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
import { Business } from './business/business.entity';
import { Specialist } from './specialist/specialist.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: true })
  password?: string;

  @Column({ nullable: true, select: true })
  lastLoggedInAt?: Date;

  @Column({ nullable: true, select: true })
  lastLoginIp?: string;

  @Column({ nullable: true, enum: UserRoles })
  role?: UserRoles;

  @Column({ type: 'uuid', nullable: true })
  businessId?: string;

  @Column({ type: 'uuid', nullable: true })
  subscriptionId?: string;

  @OneToOne(() => Business)
  @JoinColumn()
  business?: Business;

  @OneToOne(() => Subscription, subscription => subscription.account)
  @JoinColumn()
  subscription?: Subscription;
  
  @OneToOne(() => Specialist, specialist => specialist.account)
  specialist?: Specialist;

  @OneToMany(
    () => FileToCollaborator,
    fileToCollaborator => fileToCollaborator.collaborator
  )
  public fileToCollaborators!: Promise<FileToCollaborator[]>;

  @ManyToMany(() => File, file => file.collaborators)
  @JoinTable({ name: 'file_collaborator' })
  collaboratedFiles: File[];
}
