import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
import { Account } from '../../account/account.entity';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { PublicRoute } from '../../common/decorators/public-route-decorator';
import { PaginationCursorOptionsDto } from '../../common/dto';
import { AcceptCollaboratorDto } from './dto/accept-collaborator.dto';
import { AddSessionReportDto } from './dto/add-session-report.dto';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { SendSessionChatMessageDto } from './dto/send-session-chat-message.dto';
import { SessionInvite } from './session-invite/session-invite.entity';
import { CreateSessionNoteDto } from './session-note/dto/create-session-note.dto';
import { UpdateSessionNoteDto } from './session-note/dto/update-session-note.dto';
import { GetSessionReportDto } from './session-report/dto/get-session-report.dto';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@ApiBearerAuth()
@ApiTags('Session')
@Controller('/sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async searchSessions(
    @Query() query: SearchSessionDto,
    @GetAccount() account: Account,
  ): Promise<Pagination<Session>> {
    return this.sessionService.getSessions(query, account);
  }

  @Get('/info/:id')
  async getSession(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ): Promise<Session> {
    return this.sessionService.getSession(id, account);
  }

  @Get('/:id/chat')
  async getChatRoom(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.getSessionChatRoom(id, account);
  }

  @Get('/:id/chat/messages')
  async getChats(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationCursorOptionsDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.getSessionChatMessages(id, query, account);
  }

  @PublicRoute()
  @Get('/shared')
  async validateSharedSession(@Query('token') token: string) {
    return this.sessionService.validateSharedSessionToken(token);
  }

  @Get('/:id/collaborators/invitations')
  async getInvitations(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ): Promise<SessionInvite[]> {
    return this.sessionService.getInvitations(id, account);
  }

  @ApiResponseMeta({ message: 'Token verified successfully!' })
  @Get('/collaborators/invitations/:invitationId')
  async verifyCollaborationInviteToken(
    @Param() { invitationId }: AcceptCollaboratorDto,
    @GetAccount() account: Account,
  ) {
    await this.sessionService.verifyCollaborationInviteToken(
      invitationId,
      account,
    );
  }

  @Get('/:id/reports')
  async getReports(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: SearchSessionDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.getSessionReports(id, query, account);
  }

  @Get('/:sessionId/reports/:id')
  async getReport(
    @Param() { id, sessionId }: GetSessionReportDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.getSessionReport(id, sessionId, account);
  }

  @ApiResponseMeta({ message: 'Invitation sent successfully!' })
  @Post('/:id/collaborators')
  async inviteCollaborator(
    @Param('id', ParseIntPipe) id: number,
    @Body() item: InviteCollaboratorDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.inviteCollaborator(id, item, account);
  }

  @Post('/:id/share')
  async shareSession(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.shareSession(id, account);
  }

  @ApiResponseMeta({ message: 'Invitation accepted successfully!' })
  @Post('/collaborators/invitations/:invitationId')
  async acceptSessionCollaboration(
    @Param() { invitationId }: AcceptCollaboratorDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.acceptSessionCollaborationRequest(
      invitationId,
      account,
    );
  }

  @ApiResponseMeta({ message: 'Note saved successfully!' })
  @Post('/:id/notes')
  async addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() item: CreateSessionNoteDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.addNote(id, item, account);
  }

  @ApiResponseMeta({ message: 'Report added successfully!' })
  @Post('/:id/reports')
  async addSessionReport(
    @Body() item: AddSessionReportDto,
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ) {
    await this.sessionService.addSessionReport(id, item, account);
  }

  @Post('/:id/chat/messages')
  async sendChat(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendSessionChatMessageDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.sendSessionChatMessage(id, dto.message, account);
  }

  @Post('/:id/meet/join')
  async joinMeeting(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.joinSessionMeeting(id, account);
  }

  @Post('/:id/meet/leave')
  async leaveMeeting(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.leaveSessionMeeting(id, account);
  }

  @ApiResponseMeta({ message: 'Note updated successfully!' })
  @Patch('/notes/:id')
  async updateNote(
    @Body() item: UpdateSessionNoteDto,
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account: Account,
  ) {
    this.sessionService.updateNote(id, item, account);
  }

  @Delete('/:id/collaborators')
  async cancelSessionCollaboration(
    @Param('id', ParseIntPipe) sessionId: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.removeAllSessionCollaborators(
      sessionId,
      account,
    );
  }

  @Delete('/:id/share')
  async revokeViewOnlyCollaboration(
    @Param('id', ParseIntPipe) sessionId: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.revokeAnonymousSessionSharing(
      sessionId,
      account,
    );
  }

  @Delete('/:id/collaborators/:inviteId')
  async cancelInvitation(
    @Param('inviteId', ParseIntPipe) inviteId: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.cancelSessionCollaborationRequest(
      inviteId,
      account,
    );
  }

  @Delete('/:id/collaborators/:accountId')
  async removeCollaborator(
    @Param('id', ParseIntPipe) id: number,
    @Param('accountId', ParseIntPipe) accountId: number,
    @GetAccount() account: Account,
  ) {
    return this.sessionService.removeSessionCollaborator(
      id,
      accountId,
      account,
    );
  }
}
