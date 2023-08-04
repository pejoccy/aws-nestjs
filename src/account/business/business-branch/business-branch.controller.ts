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
import { ApiTags } from '@nestjs/swagger';
import { Account } from '../../../account/account.entity';
import { PaginationOptionsDto } from '../../../common/dto';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import { BusinessBranchService } from './business-branch.service';
import { CreateBusinessBranchDto } from './dto/create-business-branch-dto';
import { UpdateBusinessBranchDto } from './dto/update-business-branch-dto';

@ApiTags('Business Branches')
@Controller('businesses/branches')
export class BusinessBranchController {
  constructor(private businessBranchService: BusinessBranchService) {}

  @Get()
  async getBranches(
    @Query() dto: PaginationOptionsDto,
    @GetAccount() account: Account,
  ) {
    return this.businessBranchService.getBranches(dto, account);
  }

  @Get('/:id')
  async getBranch(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account,
  ) {
    return this.businessBranchService.getBranch(id, account);
  }

  @Post()
  async createBranch(
    @Body() dto: CreateBusinessBranchDto,
    @GetAccount() account: Account,
  ) {
    return this.businessBranchService.createBranch(dto, account);
  }

  @Patch('/:id')
  async updateBranch(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdateBusinessBranchDto,
    @GetAccount() account: Account,
  ) {
    return this.businessBranchService.updateBranch(id, dto, account);
  }

  @Delete('/:id')
  async deleteBranch(
    @Param() { id }: EntityIdDto,
    @GetAccount() account: Account,
  ) {
    return this.businessBranchService.deleteBranch(id, account);
  }
}
