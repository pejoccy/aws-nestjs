import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { File } from './file.entity';
import { FileService } from './file.service';

@Module({
  providers: [FileService],
  controllers: [FileController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([File])],
})
export class FileModule {}
