import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseService } from '../../common/base/service';
import { Patient } from './patient.entity';
import { SearchPatientDto } from './dto/search-patient.dto';
import { CreateBusinessPatientDto } from './dto/create-business-patient-dto';
import { UpdateBusinessPatientDto } from './dto/update-business-patient-dto';

@Injectable()
export class PatientService extends BaseService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {
    super();
  }

  async getPatients({
    searchText,
    limit,
    page,
    where,
  }: SearchPatientDto & Pick<FindManyOptions<Patient>, 'where'>) {
    return this.search(
      this.patientRepository,
      ['email', 'firstName', 'lastName', 'mobilePhone'],
      searchText,
      { limit, page },
      { where },
    );
  }

  async updatePatient(id: number, dto: UpdateBusinessPatientDto) {
    return this.patientRepository.update(id, dto);
  }

  async create(item: CreateBusinessPatientDto) {
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .where(
        'LOWER(patient.email) = LOWER(:email) OR patient.mobilePhone = :phone',
        { email: item.email, phone: item.mobilePhone.replace('[^0-9]', '') },
      )
      .getOne();
    if (patient) {
      throw new NotAcceptableException(
        'Patient with email or Phone already exists!',
      );
    }

    return this.patientRepository.save(item);
  }
}
