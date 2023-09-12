import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiResponseMeta } from '../../common/decorators/response.decorator';
import { EntityIdDto } from '../../common/dto/entity.dto';
import { CreatePatientDto } from './dto/create-patient-dto';
import { SearchPatientDto } from './dto/search-patient.dto';
import { UpdatePatientDto } from './dto/update-patient-dto';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';

@ApiBearerAuth()
@ApiTags('Patient')
@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async getSearch(
    @Query() dto: SearchPatientDto,
  ): Promise<Pagination<Patient>> {
    return this.patientService.getPatients(dto);
  }

  @ApiResponseMeta({ message: 'Patient created successfully!' })
  @Post()
  async setupPatient(@Body() item: CreatePatientDto) {
    return this.patientService.create(item);
  }

  @Patch('/:id')
  async updatePatient(
    @Param() { id }: EntityIdDto,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientService.updatePatient(id, dto);
  }
}
