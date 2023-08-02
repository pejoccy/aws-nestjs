import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessBranch } from './business-branch.entity';
import { CreateBusinessBranchDto } from './dto/create-business-branch-dto';

@Injectable()
export class BusinessBranchService {
  constructor(
    @InjectRepository(BusinessBranch)
    private businessContactRepository: Repository<BusinessBranch>,
  ) {}

  async create(item: CreateBusinessBranchDto) {
    const contact = await this.businessContactRepository
      .createQueryBuilder('branch')
      .where('LOWER(branch.name) = LOWER(:name)', { name: item.email })
      .getOne();
    if (contact) {
      throw new NotAcceptableException(
        'Business Contact email already exists!',
      );
    }

    return this.businessContactRepository.save(item);
  }
}
