import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessContact } from './business-contact.entity';
import { CreateBusinessContactDto } from './dto/create-business-contact-dto';

@Injectable()
export class BusinessContactService {
  constructor(
    @InjectRepository(BusinessContact)
    private businessContactRepository: Repository<BusinessContact>,
  ) {}

  async create(item: CreateBusinessContactDto) {
    const contact = await this.businessContactRepository
      .createQueryBuilder('contact')
      .where('LOWER(contact.email) = LOWER(:email)', { email: item.email })
      .getOne();
    if (contact) {
      throw new NotAcceptableException(
        'Business Contact email already exists!',
      );
    }

    return this.businessContactRepository.save(item);
  }
}
