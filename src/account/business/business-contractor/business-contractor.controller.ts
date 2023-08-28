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
import { PaginationOptionsDto } from '../../../common/dto';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import { BusinessContractorService } from './business-contractor.service';
import { SetupBusinessContractorDto } from './dto/setup-business-contractor-dto';
import { UpdateBusinessContractorDto } from './dto/update-business-contractor-dto';

@ApiBearerAuth()
@ApiTags('Business Contractors')
@Controller('businesses/contractors')
export class BusinessContractorController {
  constructor(private businessContractorService: BusinessContractorService) {}

  @Get()
  async getContractors(
    @Query() dto: PaginationOptionsDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContractorService.getContractors(dto, account);
  }

  @Get('/:id')
  async getContractor(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContractorService.getContractor(id, account);
  }

  @Post()
  async setupContractor(
    @Body() dto: SetupBusinessContractorDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContractorService.setupContractor(dto, account);
  }

  // @Patch('/:id')
  // async updateContractor(
  //   @Param() { id }: EntityIdDto,
  //   @Body() dto: UpdateBusinessContractorDto,
  //   @GetAccount() account: Account,
  // ) {
  //   return this.businessContractorService.updateContractor(id, dto, account);
  // }

  @Delete('/:id')
  async deleteContractor(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account,
  ) {
    return this.businessContractorService.deleteContractor(id, account);
  }
}
