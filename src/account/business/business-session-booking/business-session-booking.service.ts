import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { PacsService } from '../../../pacs/pacs.service';
import { Account } from '../../account.entity';
import { GetBusinessContractorBookingsDto } from '../business-contractor/dto/get-business-contractor-bookings.dto';
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

  async getBookings(options: GetBusinessContractorBookingsDto, account: Account) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    const qb = this.businessBookingRepository
      .createQueryBuilder('bookings')
      .leftJoinAndSelect('bookings.patient', 'patient')
      .leftJoinAndSelect('bookings.session', 'session')
      .leftJoinAndSelect('bookings.assignedTo', 'contractor')
      .leftJoinAndSelect('contractor.specialist', 'assignedTo')
      .leftJoinAndSelect('contractor.specialization', 'specialization')
      .leftJoinAndSelect('bookings.assignedBy', 'assignedBy')
      .leftJoinAndSelect('assignedBy.businessContact', 'byBusinessContact')
      .leftJoinAndSelect('assignedBy.specialist', 'bySpecialist')
      .leftJoinAndSelect('bookings.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.businessContact', 'businessContact')
      .leftJoinAndSelect('createdBy.specialist', 'specialist')
      .where('bookings.businessId = :businessId', { businessId })

    options.contractorId &&
      qb.andWhere(
        'bookings.assignedToId = :contractorId',
        { contractorId: options.contractorId }
      );
    
    options.startDate &&
      qb.andWhere(
        "bookings.createdAt >= :startDate",
        { startDate: options.startDate }
      );
    
    options.endDate &&
      qb.andWhere('bookings.createdAt <= :endDate', { endDate: options.endDate });


    return this.paginate(qb, options);
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
        'assignedTo',
        'assignedTo.specialist',
        'assignedTo.specialization',
        'assignedBy',
        'assignedBy.businessContact',
        'assignedBy.specialist',
        'createdBy',
        'createdBy.businessContact',
        'createdBy.specialist',
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
      businessBranchId: item.branchId,
      assignedToId: item.assignedToId || account.specialist?.contractors[0]?.id,
      assignedById: item.assignedToId && account.id,
      createdById: account.id,
    });
  }

  async deleteBooking(id: number, account: Account) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    const { affected } = await this.businessBookingRepository.update(
      { id, businessId },
      { status: false },
    );
    if (!affected) {
      throw new NotFoundException('Booking not found!');
    }
  }
}
