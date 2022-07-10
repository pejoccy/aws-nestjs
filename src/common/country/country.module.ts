import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';
import { Country } from './country.entity';
import { CountryService } from './country.service';

@Module({
  controllers: [CountryController],
  exports: [CountryService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountryService],
})
export class CountryModule {}
