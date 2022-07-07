import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>
  ) {}

  async create(item: CreatePatientDto) {
    let patient = await this
      .patientRepository
      .createQueryBuilder('patient')
      .where(
        "LOWER(patient.email) = LOWER(:name) OR patient.mobilePhone = :phone",
        { email: item.email, phone: item.mobilePhone }
      )
      .getOne();
    if (patient) {
      throw new NotAcceptableException(
        'Patient with email or Phone already exists!'
      );
    }

    return this.patientRepository.save(item);
  }
}
