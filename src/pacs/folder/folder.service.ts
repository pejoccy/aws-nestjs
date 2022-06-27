import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../account/account.entity';
import { BaseService } from '../../common/base/service';
import { SearchFolderDto } from './dto/search-folder.dto';
import { Folder } from './folder.entity';

@Injectable()
export class FolderService extends BaseService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>
  ) {
    super();
  }

  async getFolders(
    { limit, page, searchText }: SearchFolderDto,
    account: Account
  ) {
    return this.search(
      this.folderRepository,
      ['name'],
      searchText,
      { limit, page },
      { relations: ['files'], where: { accountId: account.id } }
    );
  }
}
