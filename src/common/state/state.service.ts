import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { State } from './state.entity';

@Injectable()
export class StateService extends BaseService {
  constructor(
    @InjectRepository(State)
    protected stateRepository: Repository<State>,
  ) {
    super();
  }
}
