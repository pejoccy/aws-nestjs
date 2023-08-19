import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  countryId: string;
}
