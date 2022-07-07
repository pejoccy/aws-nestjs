import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Specialization,
} from '../../common/specialization/specialization.entity';
import { CreateSpecialistDto } from './dto/create-specialist-dto';
import { Specialist } from './specialist.entity';

@Injectable()
export class SpecialistService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>
  ) {}

  async create(item: CreateSpecialistDto) {

    const specialist = await this
      .specialistRepository
      .createQueryBuilder('specialist')
      .where(
        "LOWER(specialist.email) = LOWER(:name)",
        { email: item.email }
      )
      .getOne();
    if (specialist) {
      throw new NotAcceptableException(
        'The email is in use by another Specialist!'
      );
    }
    const specialization = await this.specializationRepository
      .findOne(item.specializationId);
    if (!specialization) {
      throw new NotFoundException('Invalid specialization ID!');
    }
    
    return this.specialistRepository.save({
      specialization,
      accountId: item.accountId,
      category: item.category,
    });
  }
}
