import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../common/dto/entity.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@ApiBearerAuth()
@ApiTags('Session')
@Controller('/sessions')
export class SessionController {
  constructor(
    private sessionService: SessionService
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async searchSessions(
    @Query() query: SearchSessionDto,
    @GetAccount() account: Account
  ): Promise<Pagination<Session>> {
    return this.sessionService.getSessions(query, account);
  }

  @Get('/info/:id')
  async getSession(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account
  ): Promise<Session> {
    return this.sessionService.getSession(id, account);
  }

  @ApiResponseMeta({ message: 'Invitation sent successfully!' })
  @Post('/collaborators')
  async inviteCollaborator(@Body() item: any) {
    return this.sessionService.inviteCollaborator(item);
  }

  @ApiResponseMeta({ message: 'Invitation accepted successfully!' })
  @Patch('/collaborators')
  async acceptSessionCollaboration(@Body() item: any) {
    return this.sessionService.acceptSessionCollaboration(item);
  }

  @ApiResponseMeta({ message: 'Note saved successfully!' })
  @Post('/notes')
  async addNote(@Body() item: any) {
    return this.sessionService.addNote(item);
  }

  @ApiResponseMeta({ message: 'Note updated successfully!' })
  @Patch('/notes/:id')
  async updateNote(@Body() item: any, @Param() { id }: EntityIdDto) {
    return this.sessionService.updateNote(id, item);
  }

  @ApiResponseMeta({ message: 'Note saved successfully!' })
  @Post('/files/:id/notes')
  async addFileNote(@Body() item: any) {
    return this.sessionService.addNote(item);
  }

  @ApiResponseMeta({ message: 'Note updated successfully!' })
  @Patch('/files/:id/notes/:id')
  async updateFileNote(@Body() item: any, @Param() { id }: EntityIdDto) {
    return this.sessionService.updateNote(id, item);
  }
}
