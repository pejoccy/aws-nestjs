import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Account } from '../../account/account.entity';
import { BaseService } from '../../common/base/service';
import { SearchFileDto } from './dto/search-file.dto';
import { File } from './file.entity';

@Injectable()
export class FileService extends BaseService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {
    super();
  }

  async getFiles(
    { limit, page, searchText }: SearchFileDto,
    account: Account
  ) {
    return this.search(
      this.fileRepository,
      ['name'],
      searchText,
      { limit, page },
      { relations: ['collaborators'], where: { accountId: account.id } }
    );
  }

  async update(
    id: number,
    item: any,
    account: Account
  ) {
    item = this.excludeExtraneousKeys(item);
    const { affected, raw: file } = await this.fileRepository.update(
      { id, creatorId: account.id },
      item
    );
    if (!affected) {
      throw new ForbiddenException(
        'Insufficient access right to perform this action!'
      )
    }

    return file;
  }
}
