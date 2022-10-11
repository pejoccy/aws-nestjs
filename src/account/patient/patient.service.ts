import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService extends BaseService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {
    super();
  }

  async create(item: CreatePatientDto) {
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
