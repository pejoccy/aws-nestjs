import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationOptionsDto } from '../../../common/dto';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import { Account } from '../../account.entity';
import { BusinessContactService } from './business-contact.service';
import { UpdateBusinessContactDto } from './dto/update-business-contact-dto';
import { CreateBusinessContactDto } from './dto/create-business-contact-dto';

@ApiBearerAuth()
@ApiTags('Business Contacts')
@Controller('businesses/contacts')
export class BusinessContactController {
  constructor(private businessContactService: BusinessContactService) {}

  @Get()
  async getContacts(
    @Query() dto: PaginationOptionsDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContactService.getContacts(dto, account);
  }

  @Get('/:id')
  async getBranch(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContactService.getContact(id, account);
  }

  @Post()
  async createBranch(
    @Body() dto: CreateBusinessContactDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContactService.createContact(dto, account);
  }

  @Patch('/:id')
  async updateBranch(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdateBusinessContactDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContactService.updateContact(id, dto, account);
  }

  @Delete('/:id')
  async deleteBranch(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContactService.deleteContact(id, account);
  }
}
