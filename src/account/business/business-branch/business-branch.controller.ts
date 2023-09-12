import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Account } from '../../../account/account.entity';
import { PaginationOptionsDto } from '../../../common/dto';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import { BusinessBranchService } from './business-branch.service';
import { CreateBusinessBranchDto } from './dto/create-business-branch-dto';
import { UpdateBusinessBranchDto } from './dto/update-business-branch-dto';
import { SetActiveBusinessBranchDto } from './dto/set-active-business-branch-dto';
import { AccountTypes } from 'src/common/interfaces';

@ApiBearerAuth()
@ApiTags('Business Branches')
@Controller('businesses/branches')
export class BusinessBranchController {
  constructor(private businessBranchService: BusinessBranchService) {}

  @Get()
  async getBranches(
    @Query() dto: PaginationOptionsDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessBranchService.getBranches(dto, account);
  }

  @Get('/:id')
  async getBranch(
    @Param() { id }: EntityIdDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessBranchService.getBranch(id, account);
  }

  @Post()
  async createBranch(
    @Body() dto: CreateBusinessBranchDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessBranchService.createBranch(dto, account);
  }

  @Patch('/:id')
  async updateBranch(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdateBusinessBranchDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessBranchService.updateBranch(id, dto, account);
  }

  @Put('/active-branch')
  async setActiveBranch(
    @Body() { branchId }: SetActiveBusinessBranchDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessBranchService.setActiveBranch(account, branchId);
  }

  @Delete('/:id')
  async deleteBranch(
    @Param() { id }: EntityIdDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessBranchService.deleteBranch(id, account);
  }
}
