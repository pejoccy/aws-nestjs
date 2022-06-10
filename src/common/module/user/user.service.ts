import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base/service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super();
  }

  async updateUser(id: string, item: UpdateUserDto) {
    item = this.excludeExtraneousKeys(item);
    const { affected, raw } = await this.userRepository
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

  public async changePassword(userId: string, password: string): Promise<User> {
    const { affected, raw: [user] = [] } = await this.userRepository
      .createQueryBuilder()
      .update({ password })
      .where({ id: userId })
      .returning('*')
      .execute();
    if (!affected) {
      throw new NotAcceptableException('User not found!');
    }

    return user;
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`user with ${id} not found`);
    }
  }
}
