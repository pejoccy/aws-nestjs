import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './state.entity';
import { StateService } from './state.service';

@Module({
  controllers: [],
  exports: [StateService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([State])],
  providers: [StateService],
})
export class StateModule {}
