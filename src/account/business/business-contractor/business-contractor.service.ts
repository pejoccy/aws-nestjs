import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { PaginationOptionsDto } from '../../../common/dto';
import { Account } from '../../account.entity';
import { BusinessContractor } from './business-contractor.entity';
import { SetupBusinessContractorDto } from './dto/setup-business-contractor-dto';
import { UpdateBusinessContractorDto } from './dto/update-business-contractor-dto';

@Injectable()
export class BusinessContractorService extends BaseService {
  constructor(
    @InjectRepository(BusinessContractor)
    private businessContractorRepository: Repository<BusinessContractor>,
  ) {
    super();
  }

  async getContractors(options: PaginationOptionsDto, account: Account) {
    return this.paginate(this.businessContractorRepository, options, {
      where: { businessId: account.businessContact?.businessId },
      // relations: ['permissions'],
    });
  }

  async getContractor(id: number, account: Account) {
    return await this.businessContractorRepository.findOne({
      where: { id, businessId: account.businessContact?.businessId },
    });
  }

  // async updateContractor(
  //   id: number,
  //   dto: UpdateBusinessContractorDto,
  //   account: Account,
  // ) {
  //   return await this.businessContractorRepository.update(
  //     { id, businessId: account.businessContact?.businessId },
  //     dto,
  //   );
  // }

  async setupContractor(item: SetupBusinessContractorDto, account: Account) {
    //

    return this.businessContractorRepository.save({
      ...item,
      businessId: account.businessContact.businessId,
    });
  }

  async inviteContractor(item: SetupBusinessContractorDto, account: Account) {
    //

    return this.businessContractorRepository.save({
      ...item,
      businessId: account.businessContact.businessId,
    });
  }

  async deleteContractor(id: number, account: Account) {
    return await this.businessContractorRepository.update(
      { id, businessId: account.businessContact?.businessId },
      { status: false },
    );
  }
}
