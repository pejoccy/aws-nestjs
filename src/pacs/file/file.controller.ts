import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { ApiResponseMeta } from '../../common/decorators/response.decorator';
import { EntityIdDto } from '../../common/dto/entity.dto';
import { SearchFileDto } from './dto/search-file.dto';
import { File } from './file.entity';
import { FileService } from './file.service';

@ApiBearerAuth()
@ApiTags('Pacs')
@Controller('pacs/files')
export class FileController {
  constructor(private fileService: FileService) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async searchFiles(
    @Query() query: SearchFileDto,
    @GetAccount() account: Account,
  ): Promise<Pagination<File>> {
    return this.fileService.getFiles(query, account);
  }

  @ApiParam({ name: 'id' })
  @Patch('/:id')
  async updateFile(
    @Param() { id }: EntityIdDto,
    @Body() item: any,
    @GetAccount() account: Account,
  ): Promise<File> {
    return this.fileService.update(id, item, account);
  }

  // @ApiResponseMeta({ message: 'Note saved successfully!' })
  // @Post('/files/:id/notes')
  // async addFileNote(@Body() item: any) {
  //   return this.fileService.addNote(item);
  // }

  // @ApiResponseMeta({ message: 'Note updated successfully!' })
  // @Patch('/files/:id/notes/:noteId')
  // async updateFileNote(@Body() item: any, @Param() { id }: EntityIdDto) {
  //   return this.fileService.updateNote(id, item);
  // }
}
