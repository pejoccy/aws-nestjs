import { FileModality } from 'src/common/interfaces';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { BaseEntity } from '../../common/base/_entity';

export enum ITemplateControlTypes {
  CHECKBOX = 'checkbox',
  MULTISELECT = 'multiselect',
  RADIO = 'radio',
  SELECT = 'select',
  TEXT = 'text',
  TEXTAREA = 'textarea',
}

export interface ITemplateControlOptions {
  label: string,
  value: string,
}

export interface ITemplateControl {
  sequence?: number;
  name: string;
  label: string;
  type: ITemplateControlTypes;
  required: boolean;
  options?: ITemplateControlOptions[];
}

@Entity()
export class ReportTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ enum: FileModality })
  modality: FileModality;

  @Column({ type: 'jsonb', array: true })
  controls: ITemplateControl[];
}
