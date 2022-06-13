import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../common/interfaces';

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

  @Column({ nullable: true, enum: UserRole })
  role?: UserRole;
}
