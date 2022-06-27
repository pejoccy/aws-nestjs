import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { AccountService } from './account.service';

@ApiTags('Dashboard')
@Controller()
@UseGuards(PermissionGuard)
export class AccountController {
  constructor(
    private accountService: AccountService
  ) {}

}
