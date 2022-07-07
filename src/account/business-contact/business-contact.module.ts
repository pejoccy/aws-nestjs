import { Module } from '@nestjs/common';
import { BusinessContactService } from './business-contact.service';
import { BusinessContactController } from './business-contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessContact } from './business-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessContact])],
  providers: [BusinessContactService],
  controllers: [BusinessContactController],
  exports: [BusinessContactService, TypeOrmModule],
})
export class BusinessContactModule {}
