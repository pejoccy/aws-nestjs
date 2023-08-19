import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { PaginationOptionsDto } from '../../../common/dto';
import { BusinessContactRoles } from '../../../common/interfaces';
import { Account } from '../../account.entity';
import { BusinessContact } from './business-contact.entity';
import { CreateBusinessContactDto } from './dto/create-business-contact-dto';
import { UpdateBusinessContactDto } from './dto/update-business-contact-dto';

@Injectable()
export class BusinessContactService extends BaseService {
  constructor(
    @InjectRepository(BusinessContact)
    private businessContactRepository: Repository<BusinessContact>,
  ) {
    super();
  }

  async getContacts(options: PaginationOptionsDto, account: Account) {
    return this.paginate(this.businessContactRepository, options, {
      where: { businessId: account.businessContact?.businessId },
      relations: ['account'],
    });
  }

  async getContact(id: number, account: Account) {
    return await this.businessContactRepository.findOne({
      where: { id, businessId: account.businessContact?.businessId },
    });
  }

  async updateContact(
    id: number,
    dto: UpdateBusinessContactDto,
    account: Account,
  ) {
    return await this.businessContactRepository.update(
      { id, businessId: account.businessContact.businessId },
      dto,
    );
  }

  async createContact(item: CreateBusinessContactDto, account: Account) {
    const contact = await this.businessContactRepository
      .createQueryBuilder('contact')
      .where(
        'LOWER(contact.email) = LOWER(:email) AND "businessId" = :businessId',
        { email: item.email, businessId: account.businessContact.businessId },
      )
      .getOne();
    if (contact) {
      throw new NotAcceptableException(
        'Business Contact email already exists!',
      );
    }

    return this.businessContactRepository.save({
      ...item,
      role: BusinessContactRoles.DESK_OFFICER,
      businessId: account.businessContact.businessId,
    });
  }

  async deleteContact(id: number, account: Account) {
    return await this.businessContactRepository.update(
      { id, businessId: account.businessContact?.businessId },
      { status: false },
    );
  }
}
