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
import { GetAccount } from '../../common/decorators/get-user-decorator';
import { ApiResponseMeta } from '../../common/decorators/response.decorator';
import { EntityIdDto } from '../../common/dto/entity.dto';
import { AccountTypes } from '../../common/interfaces';
import { Account } from '../account.entity';
import { CreateBusinessPatientDto } from '../patient/dto/create-business-patient-dto';
import { SearchPatientDto } from '../patient/dto/search-patient.dto';
import { PatientService } from '../patient/patient.service';
import { BusinessService } from './business.service';
import { UpdateBusinessDto } from './dto/update-business-dto';
import { UpdateBusinessPatientDto } from '../patient/dto/update-business-patient-dto';

@ApiBearerAuth()
@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(
    private businessService: BusinessService,
    private patientService: PatientService,
  ) {}

  @Get('/patients/:id')
  async getPatients(
    @Param() { id }: EntityIdDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.patientService.getPatient(
      id,
      account.businessContact.businessId,
    );
  }

  @Get('/patients')
  async getPatient(
    @Query() dto: SearchPatientDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.patientService.getPatients({
      ...dto,
      where: { businessId: account.businessContact.businessId },
    });
  }

  @ApiResponseMeta({ message: 'Patient created successfully!' })
  @Post('/patients')
  async setupPatient(
    @Body() item: CreateBusinessPatientDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.patientService.create({
      ...item,
      businessId: account.businessContact.businessId,
    });
  }

  @Patch('/patients/:id')
  async updatePatient(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdateBusinessPatientDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) _: Account,
  ) {
    return this.patientService.updatePatient(id, dto);
  }

  @Patch()
  async updateBusiness(
    @Body() dto: UpdateBusinessDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    return this.businessService.update(dto, account);
  }

  @ApiResponseMeta({ message: 'Patient deleted successfully!' })
  @Delete('/patients/:id')
  async deletePatient(
    @Param() { id }: EntityIdDto,
    @GetAccount({ accountTypes: [AccountTypes.BUSINESS] }) account: Account,
  ) {
    await this.patientService.deletePatient(
      id,
      account.businessContact.businessId,
    );
  }
}
