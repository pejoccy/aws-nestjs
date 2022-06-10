import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../../interfaces';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: true })
  password?: string;

  @Column({ nullable: true, select: true })
  lastLoggedInAt?: Date;

  @Column({ nullable: true, select: true })
  lastLoggedIp?: string;

  @Column({ default: false, select: false })
  passwordReset: boolean;

  @Column({ nullable: true, enum: UserRole })
  role?: UserRole;
}
