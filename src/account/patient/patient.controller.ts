import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
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
}
