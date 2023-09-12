import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Business } from '../../account/business/business.entity';
import { State } from '../state/state.entity';
@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @OneToMany(() => Business, (business) => business.country)
  businesses?: Business[];

  @OneToMany(() => State, (state) => state.country)
  states?: State[];
}
