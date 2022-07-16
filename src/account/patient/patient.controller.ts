import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiResponseMeta } from 'src/common/decorators/response.decorator';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient-dto';
import { SearchPatientDto } from './dto/search-patient.dto';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';

@ApiBearerAuth()
@ApiTags('Patient')
@Controller('patients')
export class PatientController {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private patientService: PatientService
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async getSearch(
    @Query() { limit, page, searchText }: SearchPatientDto
  ): Promise<Pagination<Patient>> {
    return this.patientService.search(
      this.patientRepository,
      ['email', 'firstName', 'lastName', 'mobilePhone'],
      searchText,
      { limit, page }
    );
  }

  @ApiResponseMeta({ message: 'Patient created successfully!' })
  @Post()
  async setupPatient(@Body() item: CreatePatientDto) {
    return this.patientService.create(item);
  }
}
