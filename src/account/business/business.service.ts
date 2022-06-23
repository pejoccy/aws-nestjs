import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { CreateBusinessDto } from './dto/create-business-dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>
  ) {}

  async create(business: CreateBusinessDto) {
    let mBusiness = await this
      .businessRepository
      .createQueryBuilder('business')
      .where(
        "LOWER(business.name) = LOWER(:name)",
        { name: business.name }
      )
      .getOne();
    if (mBusiness) {
      throw new NotAcceptableException('Business name already exists!');
    }

    return this.businessRepository.save(business);
  }
}
