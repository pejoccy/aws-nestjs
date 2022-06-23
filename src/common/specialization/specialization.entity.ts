import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
 } from 'typeorm';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ select: false })
  filter: string;

  @Column({ default: false, select: false })
  status: boolean;
}
