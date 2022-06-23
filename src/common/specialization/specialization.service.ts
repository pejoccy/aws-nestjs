import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { CreateSpecializationDto } from './dto/create-specialization-dto';
import { Specialization } from './specialization.entity';

@Injectable()
export class SpecializationService extends BaseService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>
  ) {
    super();
  }

  async setupSpecialization({ title }: CreateSpecializationDto) {
    const { raw: specialization } = await this
      .specializationRepository
      .createQueryBuilder()
      .insert()
      .into(Specialization)
      .values({ title, filter: title.toLowerCase().trim() })
      .orUpdate(['updatedAt'], ['filter'])
      .execute();

    return specialization;
  }
}
