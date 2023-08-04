import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../account.entity';
import { BusinessContact } from './business-contact/business-contact.entity';
import { CreateBusinessContactDto } from './business-contact/dto/create-business-contact-dto';
import { Business } from './business.entity';
import { CreateBusinessDto } from './dto/create-business-dto';
import { UpdateBusinessDto } from './dto/update-business-dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(BusinessContact)
    private businessContactRepository: Repository<BusinessContact>,
  ) {}

  async update(dto: UpdateBusinessDto, account: Account) {
    return await this.businessRepository.update(
      { id: account.businessContact.businessId },
      dto,
    );
  }

  async setup(item: CreateBusinessDto, contact: CreateBusinessContactDto) {
    let business = await this.businessRepository
      .createQueryBuilder('business')
      .where('LOWER(business.name) = LOWER(:name)', { name: item.name })
      .getOne();
    if (business) {
      throw new NotAcceptableException('Business name already exists!');
    }

    business = await this.businessRepository.save(item);
    await this.businessContactRepository.save({
      ...contact,
      businessId: business.id,
    });

    return business;
  }
}
