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
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    return this.paginate(this.businessBookingRepository, options, {
      where: { businessId },
      relations: [
        'patient',
        'session',
        'referredBy',
        'referredBy.businessContact',
        'createdBy',
        'createdBy.businessContact',
        'createdBy.specialist',
        // 'createdBy.specialist.',
      ],
    });
  }

  async getBooking(id: number, account: Account) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    return await this.businessBookingRepository.findOne({
      where: { id, businessId },
      relations: [
        'patient',
        'session',
        'referredBy',
        'referredBy.businessContact',
        'createdBy',
        'createdBy.businessContact',
      ],
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
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    const session = await this.pacsService.uploadBulk(
      { ...item, businessId, files },
      account,
    );

    return await this.businessBookingRepository.save({
      ...item,
      businessId,
      sessionId: session.id,
      createdById: account.id,
    });
  }

  async deleteBooking(id: number, account: Account) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    return await this.businessBookingRepository.update(
      { id, businessId },
      { status: false },
    );
  }
}
