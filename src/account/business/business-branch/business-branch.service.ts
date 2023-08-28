import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { CacheService } from '../../../common/cache/cache.service';
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
    private cacheService: CacheService,
  ) {
    super();
  }

  async getBranches(options: PaginationOptionsDto, account: Account) {
    return this.paginate(this.businessBranchRepository, options, {
      where: { businessId: account.businessContact?.businessId },
      relations: ['state', 'country'],
    });
  }

  async getBranch(id: number, account: Account) {
    try {
      return await this.businessBranchRepository.findOneOrFail({
        where: { id, businessId: account.businessContact?.businessId },
        relations: ['state', 'country'],
      });
    } catch (error) {
      throw new NotFoundException('Branch not found!');
    }
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

  async setActiveBranch(account: Account, id?: number) {
    const cacheKey = `${account.id}:activeBranch`;
    if (!id) {
      await this.cacheService.remove(cacheKey);
      return;
    }

    const branch = await this.businessBranchRepository.findOne({
      where: { id, businessId: account.businessContact?.businessId },
    });
    if (!branch) {
      throw new NotAcceptableException('Invalid business branch!');
    }
    await this.cacheService.set(cacheKey, id);
  }

  async createBranch(item: CreateBusinessBranchDto, account: Account) {
    try {
      const branch = await this.businessBranchRepository
        .createQueryBuilder('branch')
        .where(
          'LOWER(branch.name) = LOWER(:name) AND "businessId" = :businessId AND status = true',
          { name: item.name, businessId: account.businessContact.businessId },
        )
        .getOne();
      if (branch) {
        throw new NotAcceptableException(
          'Business branch name already exists!',
        );
      }

      return await this.businessBranchRepository.save({
        ...item,
        businessId: account.businessContact.businessId,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteBranch(id: number, account: Account) {
    return await this.businessBranchRepository.update(
      { id, businessId: account.businessContact?.businessId },
      { status: false },
    );
  }
}
