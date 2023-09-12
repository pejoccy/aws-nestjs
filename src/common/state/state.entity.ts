import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Country } from '../country/country.entity';
@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  countryId: number;

  @ManyToOne(() => Country, (country) => country.states)
  country: Country;
}
