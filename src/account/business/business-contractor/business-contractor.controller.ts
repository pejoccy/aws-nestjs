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
import { Account } from '../../account.entity';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import {
  AccountTypes,
  BusinessContractorRoles,
} from '../../../common/interfaces';
import { BusinessContractorService } from './business-contractor.service';
import { SetupBusinessContractorDto } from './dto/setup-business-contractor-dto';
import { UpdateBusinessContractorDto } from './dto/update-business-contractor-dto';
import { GetBusinessContractorDto } from './dto/get-business-contractor.dto';

@ApiBearerAuth()
@ApiTags('Business Contractors')
@Controller('businesses/contractors')
export class BusinessContractorController {
  constructor(private businessContractorService: BusinessContractorService) {}

  @Get()
  async getContractors(
    @Query() dto: GetBusinessContractorDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessContractorService.getContractors(dto, account);
  }

  @Get('/:id/info')
  async getContractor(
    @Param() { id }: EntityIdDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessContractorService.getContractor(id, account);
  }

  @Post()
  async setupContractor(
    @Body() dto: SetupBusinessContractorDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessContractorService.setupContractor(dto, account);
  }

  @Patch('/:id')
  async updateContractor(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdateBusinessContractorDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessContractorService.updateContractor(id, dto, account);
  }

  // @Delete('/:id')
  // async deleteContractor(
  //   @Param() { id }: EntityIdDto,
  //   @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  // ) {
  //   return this.businessContractorService.deleteContractor(id, account);
  // }
}
