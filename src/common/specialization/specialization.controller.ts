import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicRoute } from '../decorators/public-route-decorator';
import { PaginationOptionsDto } from '../dto';
import { Specialization } from './specialization.entity';
import { SpecializationService } from './specialization.service';

@ApiTags('Specialization')
@Controller('specializations')
export class SpecializationController {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    private specializationService: SpecializationService,
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get()
  @PublicRoute()
  async search(
    @Query('searchText') searchText?: string,
    @Query() pagination?: PaginationOptionsDto,
  ) {
    return this.specializationService.search(
      this.specializationRepository,
      ['filter'],
      searchText,
      pagination,
      { where: { status: true } },
    );
  }
}
