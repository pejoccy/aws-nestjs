import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessContactService } from '../business-contact/business-contact.service';
import { CreateBusinessContactDto } from '../business-contact/dto/create-business-contact-dto';
import { Business } from './business.entity';
import { CreateBusinessDto } from './dto/create-business-dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private businessContactService: BusinessContactService,
  ) {}

  async setup(item: CreateBusinessDto, contact: CreateBusinessContactDto) {
    let business = await this.businessRepository
      .createQueryBuilder('business')
      .where('LOWER(business.name) = LOWER(:name)', { name: item.name })
      .getOne();
    if (business) {
      throw new NotAcceptableException('Business name already exists!');
    }
    business = await this.businessRepository.save(item);
    await this.businessContactService.create({
      ...contact,
      businessId: business.id,
    });

    return business;
  }
}
