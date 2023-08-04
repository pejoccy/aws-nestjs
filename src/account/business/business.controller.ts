import { Body, Controller, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { Account } from '../account.entity';
import { BusinessService } from './business.service';
import { UpdateBusinessDto } from './dto/update-business-dto';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Patch()
  async updateBusiness(
    @Body() dto: UpdateBusinessDto,
    @GetAccount() account: Account,
  ) {
    return this.businessService.update(dto, account);
  }
}
