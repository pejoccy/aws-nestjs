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
import { PaginationOptionsDto } from '../../../common/dto/pagination-options.dto';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import {
  AccountTypes,
  BusinessContractorRoles,
} from '../../../common/interfaces';
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
  async getBusinessContacts(
    @Query() dto: PaginationOptionsDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessContactService.getContacts(dto, account);
  }

  @Get('/:id')
  async getBusinessContact(
    @Param() { id }: EntityIdDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessContactService.getContact(id, account);
  }

  @Post()
  async createBusinessContact(
    @Body() dto: CreateBusinessContactDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessContactService.createContact(dto, account);
  }

  @Patch('/:id')
  async updateBusinessContact(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdateBusinessContactDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessContactService.updateContact(id, dto, account);
  }

  @Delete('/:id')
  async deleteBusinessContact(
    @Param() { id }: EntityIdDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessContactService.deleteContact(id, account);
  }
}
