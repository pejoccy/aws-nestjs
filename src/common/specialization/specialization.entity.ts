import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
 } from 'typeorm';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column({ default: true, select: false })
  status: boolean;
}
