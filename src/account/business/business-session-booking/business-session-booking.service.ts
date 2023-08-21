import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { PaginationOptionsDto } from '../../../common/dto';
import { PacsService } from '../../../pacs/pacs.service';
import { Account } from '../../account.entity';
import { BusinessSessionBooking } from './business-session-booking.entity';
import { CreateBusinessBookingDto } from './dto/create-business-booking-dto';
// import { UpdateBusinessBookingDto } from './dto/update-business-booking-dto';

@Injectable()
export class BusinessSessionBookingService extends BaseService {
  constructor(
    @InjectRepository(BusinessSessionBooking)
    private businessBookingRepository: Repository<BusinessSessionBooking>,
    private pacsService: PacsService,
  ) {
    super();
  }

  async getBookings(options: PaginationOptionsDto, account: Account) {
    return this.paginate(this.businessBookingRepository, options, {
      where: { businessId: account.businessContact?.businessId },
      // relations: ['permissions'],
    });
  }

  async getBooking(id: number, account: Account) {
    return await this.businessBookingRepository.findOne({
      where: { id, businessId: account.businessContact?.businessId },
    });
  }

  // async updateBooking(
  //   id: number,
  //   dto: UpdateBusinessBranchDto,
  //   account: Account,
  // ) {
  //   return await this.businessBookingRepository.update(
  //     { id, businessId: account.businessContact?.businessId },
  //     dto,
  //   );
  // }

  async createBooking(
    item: CreateBusinessBookingDto,
    files: Express.Multer.File[],
    account: Account,
  ) {
    const session = await this.pacsService.uploadBulk(
      { ...item, files },
      account,
    );

    return await this.businessBookingRepository.save({
      ...item,
      sessionId: session.id,
      createdBy: account.businessContact.accountId,
    });
  }

  async deleteBooking(id: number, account: Account) {
    return await this.businessBookingRepository.update(
      { id, businessId: account.businessContact?.businessId },
      { status: false },
    );
  }
}
