import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { Country } from './country.entity';

@Injectable()
export class CountryService extends BaseService {
  constructor(
    @InjectRepository(Country)
    protected countryRepository: Repository<Country>
  ) {
    super();
  }
}
