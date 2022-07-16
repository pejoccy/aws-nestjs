import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityIdDto } from 'src/common/dto/entity.dto';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { SearchFileDto } from './dto/search-file.dto';
import { File } from './file.entity';
import { FileService } from './file.service';

@ApiBearerAuth()
@ApiTags('Pacs')
@Controller('pacs/files')
export class FileController {
  constructor(
    private fileService: FileService
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async searchFiles(
    @Query() query: SearchFileDto,
    @GetAccount() account: Account
  ): Promise<Pagination<File>> {
    return this.fileService.getFiles(query, account);
  }

  @ApiParam({ name: 'id' })
  @Patch('/:id')
  async updateFile(
    @Param() { id }: EntityIdDto,
    @Body() item: any,
    @GetAccount() account: Account
  ): Promise<File> {
    return this.fileService.update(id, item, account);
  }
}