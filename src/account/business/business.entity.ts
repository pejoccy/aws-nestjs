import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
