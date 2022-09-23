import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../../../account/account.entity';
import { FeatureSlugs } from '../../../common/interfaces';
import { Session } from '../session.entity';

@Entity()
export class SessionToCollaborator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  collaboratorId: number;

  @Column()
  fileId: number;

  @Column({ enum: FeatureSlugs})
  permission: FeatureSlugs;

  @ManyToOne(() => Session, session => session.sessionToCollaborators)
  session: Session;

  @ManyToOne(() => Account, collaborator => collaborator.sessionToCollaborators)
  collaborator: Account;
}
