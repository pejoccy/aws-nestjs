import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessContactController } from './business-contact.controller';
import { BusinessContact } from './business-contact.entity';
import { BusinessContactService } from './business-contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessContact])],
  providers: [BusinessContactService],
  controllers: [BusinessContactController],
  exports: [BusinessContactService, TypeOrmModule],
})
export class BusinessContactModule {}
