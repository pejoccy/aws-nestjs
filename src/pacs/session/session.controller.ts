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
import { AcceptCollaboratorDto } from './dto/accept-collaborator.dto';
import { CreateSessionNoteDto } from './dto/create-session-note.dto';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
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
  @Post('/:id/collaborators')
  async inviteCollaborator(
    @Param() { id }: EntityIdDto,
    @Body() item: InviteCollaboratorDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.inviteCollaborator(id, item, account);
  }

  @ApiResponseMeta({ message: 'Invitation accepted successfully!' })
  @Post('/collaborators/invitations/:invitationId')
  async acceptSessionCollaboration(
    @Param() { invitationId }: AcceptCollaboratorDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.acceptSessionCollaboration(
      invitationId,
      account
    );
  }

  @ApiResponseMeta({ message: 'Note saved successfully!' })
  @Post('/:id/notes')
  async addNote(
    @Param() { id }: EntityIdDto,
    @Body() item: CreateSessionNoteDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.addNote(id, item, account);
  }

  @ApiResponseMeta({ message: 'Note updated successfully!' })
  @Patch('/:id/notes/:noteId')
  async updateNote(@Body() item: CreateSessionNoteDto, @Param() { id }: EntityIdDto) {
    return this.sessionService.updateNote(id, item);
  }
}
