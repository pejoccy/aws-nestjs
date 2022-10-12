import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './feature.entity';

@Module({
  controllers: [],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Feature])],
  providers: [],
})
export class FeatureModule {}
