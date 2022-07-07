import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { SearchSessionDto } from './dto/search-session.dto';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@ApiBearerAuth()
@ApiTags('Pacs')
@Controller('pacs/sessions')
export class SessionController {
  constructor(
    private sessionService: SessionService
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async searchFolders(
    @Query() query: SearchSessionDto,
    @GetAccount() account: Account
  ): Promise<Pagination<Session>> {
    return this.sessionService.getSessions(query, account);
  }
}
