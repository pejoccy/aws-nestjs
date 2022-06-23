import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  // ApiBasicAuth,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { ResourcePermission } from '../decorators/permission.decorator';
import { PublicRoute } from '../decorators/public-route-decorator';
import { PaginationOptionsDto } from '../dto';
import { EntityIdStringDto, PermissionIdStringDto } from '../dto/entity-dto';
import { ResourcePermissions } from '../interfaces';
import { Plan } from './plan.entity';
import { PlanService } from './plan.service';

@ApiBearerAuth()
@ApiTags('Plan')
@Controller('plans')
@UseGuards(PermissionGuard)
export class PlanController {
  constructor(private planService: PlanService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  @PublicRoute()
  async getPlans(
    @Query() query: PaginationOptionsDto
  ): Promise<Pagination<Plan>> {
    return this.planService.getPlans(query);
  }

  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'permissionId' })
  @Post('/:id/permissions/:permissionId')
  @ResourcePermission(ResourcePermissions.SCAN_AND_UPLOAD)
  async addPermission(
    @Param() { permissionId }: PermissionIdStringDto,
    @Param() { id }: EntityIdStringDto
  ) {
    return this.planService.addPermission(id, permissionId);
  }

  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'permissionId' })
  @Delete('/:id/permissions/:permissionId')
  async removePermission(
    @Param() { permissionId }: PermissionIdStringDto,
    @Param() { id }: EntityIdStringDto
  ) {
    return this.planService.removePermission(id, permissionId);
  }
}
