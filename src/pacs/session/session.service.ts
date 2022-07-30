import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../account/account.entity';
import { BaseService } from '../../common/base/service';
import { EntityIdDto } from '../../common/dto/entity.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { Session } from './session.entity';

@Injectable()
export class SessionService extends BaseService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>
  ) {
    super();
  }

  async getSessions(
    { limit, page, searchText }: SearchSessionDto,
    account: Account
  ) {
    return this.search(
      this.sessionRepository,
      ['name'],
      searchText,
      { limit, page },
      { relations: ['files'], where: { creatorId: account.id } }
    );
  }

  async getSession(
   id: number,
    account: Account
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id, creatorId: account.id },
      relations: ['files']
    });
    if (!session) {
      throw new NotFoundException('Session not found!');
    }

    return session;
  }
  
  async inviteCollaborator(item: any) {

  }
  
  async acceptSessionCollaboration(item: any) {

  }

  async addNote(item: any) {
    
  }

  async updateNote(id: number, item: any) {

  }
}
