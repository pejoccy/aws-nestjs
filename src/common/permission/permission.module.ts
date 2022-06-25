import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';

@Module({
  controllers: [],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [],
})
export class PermissionModule {}
