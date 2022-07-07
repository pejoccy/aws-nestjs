import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BusinessContact } from '../business-contact/business-contact.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  email: string;

  @Column()
  contactAddress: string;

  @Column()
  mobilePhone: string;  

  @Column()
  website: string;

  @Column()
  logoId: number;

  @OneToMany(() => BusinessContact, contact => contact.business)
  contacts: BusinessContact[];

}
