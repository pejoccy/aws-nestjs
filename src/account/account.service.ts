import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base/service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from './account.entity';

@Injectable()
export class AccountService extends BaseService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {
    super();
  }

  async updateUser(id: string, item: UpdateUserDto) {
    item = this.excludeExtraneousKeys(item);
    const { affected, raw } = await this.accountRepository
      .createQueryBuilder()
      .update(item)
      .where({ id })
      .returning('*')
      .execute();
    if (!affected) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }

    return raw[0];
  }

  public async changePassword(userId: string, password: string): Promise<Account> {
    const { affected, raw: [user] = [] } = await this.accountRepository
      .createQueryBuilder()
      .update({ password, isVerified: true })
      .where({ id: userId })
      .returning('*')
      .execute();
    if (!affected) {
      throw new NotAcceptableException('User not found!');
    }

    return user;
  }

  async deleteUser(id: string) {
    const result = await this.accountRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`user with ${id} not found`);
    }
  }
}
