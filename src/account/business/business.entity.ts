import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from '../account.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  email: string;

  @Column()
  contactAddress: string;

  @Column()
  phoneNumber: string;  

  @Column()
  website: string;

  @Column()
  logo: string;

  @OneToMany(() => Account, account => account.business)
  accounts: Account[];

}
