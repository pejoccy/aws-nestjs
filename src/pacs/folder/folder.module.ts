import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './folder.entity';

@Module({
  providers: [FolderService],
  controllers: [FolderController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Folder])],
})
export class FolderModule {}
