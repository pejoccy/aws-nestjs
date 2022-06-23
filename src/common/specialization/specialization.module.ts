import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationController } from './specialization.controller';
import { Specialization } from './specialization.entity';
import { SpecializationService } from './specialization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Specialization])],
  providers: [SpecializationService],
  controllers: [SpecializationController],
  exports: [TypeOrmModule, SpecializationService]
})
export class SpecializationModule {}
