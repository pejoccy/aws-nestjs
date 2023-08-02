import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './state.entity';

@Module({
  controllers: [],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([State])],
  providers: [],
})
export class StateModule {}
