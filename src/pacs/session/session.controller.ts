import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../common/dto/entity.dto';
import { AcceptCollaboratorDto } from './dto/accept-collaborator.dto';
import { CreateSessionNoteDto } from './session-note/dto/create-session-note.dto';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { Session } from './session.entity';
import { SessionService } from './session.service';
import { UpdateSessionNoteDto } from './session-note/dto/update-session-note.dto';
import { AddSessionReportDto } from './dto/add-session-report.dto';
import { GetSessionReportDto } from './session-report/dto/get-session-report.dto';
import { PaginationCursorOptionsDto } from 'src/common/dto';
import { SendSessionChatMessageDto } from './dto/send-session-chat-message.dto';

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

  @ApiResponseMeta({ message: 'Token verified successfully!' })
  @Get('/collaborators/invitations/:invitationId')
  async verifyCollaborationInviteToken(
    @Param() { invitationId }: AcceptCollaboratorDto,
    @GetAccount() account: Account
  ) {
    await this.sessionService.verifyCollaborationInviteToken(
      invitationId,
      account
    );
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
  @Patch('/notes/:id')
  async updateNote(
    @Body() item: UpdateSessionNoteDto,
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account
  ) {
    this.sessionService.updateNote(id, item, account);
  }

  @Get('/:id/reports')
  async getReports(
    @Param() { id }: EntityIdDto,
    @Query() query: SearchSessionDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.getSessionReports(id, query, account);
  }

  @Get('/:sessionId/reports/:id')
  async getReport(
    @Param() { id, sessionId }: GetSessionReportDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.getSessionReport(id, sessionId, account);
  }

  @ApiResponseMeta({ message: 'Report added successfully!' })
  @Post('/:id/reports')
  async addSessionReport(
    @Body() item: AddSessionReportDto,
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account
  ) {
    await this.sessionService.addSessionReport(id, item, account);
  }

  @Get('/:id/chat')
  async getChatRoom(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.getSessionChatRoom(id, account);
  }

  @Get('/:id/chat/messages')
  async getChats(
    @Param() { id }: EntityIdDto,
    @Query() query: PaginationCursorOptionsDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.getSessionChatMessages(id, query, account);
  }

  @Post('/:id/chat/messages')
  async sendChat(
    @Param() { id }: EntityIdDto,
    @Body() dto: SendSessionChatMessageDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.sendSessionChatMessage(id, dto.message, account);
  }

  @Post('/:id/meet/join')
  async joinMeeting(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.joinSessionMeeting(id, account);
  }

  @Post('/:id/meet/leave')
  async leaveMeeting(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account
  ) {
    return this.sessionService.leaveSessionMeeting(id, account);
  }

}
