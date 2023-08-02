import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryId: string;

  @Column()
  name: string;

  @Column()
  code: string;
}
