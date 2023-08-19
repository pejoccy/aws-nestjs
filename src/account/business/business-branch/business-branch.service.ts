import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { PaginationOptionsDto } from '../../../common/dto';
import { Account } from '../../account.entity';
import { BusinessBranch } from './business-branch.entity';
import { CreateBusinessBranchDto } from './dto/create-business-branch-dto';
import { UpdateBusinessBranchDto } from './dto/update-business-branch-dto';

@Injectable()
export class BusinessBranchService extends BaseService {
  constructor(
    @InjectRepository(BusinessBranch)
    private businessBranchRepository: Repository<BusinessBranch>,
  ) {
    super();
  }

  async getBranches(options: PaginationOptionsDto, account: Account) {
    return this.paginate(this.businessBranchRepository, options, {
      where: { businessId: account.businessContact?.businessId },
      // relations: ['permissions'],
    });
  }

  async getBranch(id: number, account: Account) {
    return await this.businessBranchRepository.findOne({
      where: { id, businessId: account.businessContact?.businessId },
    });
  }

  async updateBranch(
    id: number,
    dto: UpdateBusinessBranchDto,
    account: Account,
  ) {
    return await this.businessBranchRepository.update(
      { id, businessId: account.businessContact?.businessId },
      dto,
    );
  }

  async createBranch(item: CreateBusinessBranchDto, account: Account) {
    const branch = await this.businessBranchRepository
      .createQueryBuilder('branch')
      .where(
        'LOWER(branch.name) = LOWER(:name) "businessId" = :businessId AND status = 1',
        { name: item.name, businessId: account.businessContact.businessId },
      )
      .getOne();
    if (branch) {
      throw new NotAcceptableException('Business branch name already exists!');
    }

    return this.businessBranchRepository.save({
      ...item,
      businessId: account.businessContact.businessId,
    });
  }

  async deleteBranch(id: number, account: Account) {
    return await this.businessBranchRepository.update(
      { id, businessId: account.businessContact?.businessId },
      { status: false },
    );
  }
}
