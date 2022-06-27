import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { SearchFolderDto } from './dto/search-folder.dto';
import { Folder } from './folder.entity';
import { FolderService } from './folder.service';

@ApiBearerAuth()
@ApiTags('Pacs')
@Controller('pacs/folders')
export class FolderController {
  constructor(
    private folderService: FolderService
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async searchFolders(
    @Query() query: SearchFolderDto,
    @GetAccount() account: Account
  ): Promise<Pagination<Folder>> {
    return this.folderService.getFolders(query, account);
  }
}
