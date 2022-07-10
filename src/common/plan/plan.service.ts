import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/service';
import { PaginationOptionsDto } from '../dto';
import { PG_DB_ERROR_CODES } from '../interfaces';
import { Plan } from './plan.entity';

@Injectable()
export class PlanService extends BaseService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>
  ) {
    super();
  }

  async getPlans(options: PaginationOptionsDto) {
    return this.paginate(
      this.planRepository,
      options,
      { relations: ['permissions'] }
    );
  }

  async addPermission(planId: number, permissionId: number) {
    try {
      await this.planRepository
        .createQueryBuilder()
        .relation(Plan, 'permissions')
        .of({ id: planId })
        .add({ id: permissionId });
    } catch (error) {
      if (error.code === PG_DB_ERROR_CODES.CONFLICT) {
        throw new NotAcceptableException(
          'Permission already added!'
        );
      }
      throw error;
    }
  }

  async removePermission(planId: number, permissionId: number) {
    try {
      await this.planRepository
        .createQueryBuilder()
        .relation(Plan, 'permissions')
        .of({ id: planId })
        .remove({ id: permissionId });
    } catch (error) {
      if (error.code === PG_DB_ERROR_CODES.CONFLICT) {
        throw new NotAcceptableException(
          'Permission already removed!'
        );
      }
      throw error;
    }
  }
}
