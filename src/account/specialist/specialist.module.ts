import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from './specialist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist])],
  providers: [SpecialistService],
  controllers: [SpecialistController],
  exports: [SpecialistService, TypeOrmModule],
})
export class SpecialistModule {}
