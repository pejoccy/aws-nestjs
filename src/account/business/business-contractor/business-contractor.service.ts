import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../../../account/account.service';
import { AppUtilities } from '../../../app.utilities';
import { BaseService } from '../../../common/base/service';
import { AccountTypes, SpecialistCategories } from '../../../common/interfaces';
import { MailerService } from '../../../common/mailer/mailer.service';
import { Specialization } from '../../../common/specialization/specialization.entity';
import { Account } from '../../account.entity';
import { BusinessContractor } from './business-contractor.entity';
import { SetupBusinessContractorDto } from './dto/setup-business-contractor-dto';
import { UpdateBusinessContractorDto } from './dto/update-business-contractor-dto';
import { GetBusinessContractorDto } from './dto/get-business-contractor.dto';
import { GetBusinessContractorBookingsDto } from './dto/get-business-contractor-bookings.dto';

@Injectable()
export class BusinessContractorService extends BaseService {
  constructor(
    @InjectRepository(BusinessContractor)
    private businessContractorRepository: Repository<BusinessContractor>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    private accountService: AccountService,
    private mailService: MailerService,
  ) {
    super();
  }

  async getContractors(options: GetBusinessContractorDto, account: Account) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    return this.paginate(this.businessContractorRepository, options, {
      where: {
        businessId,
        ...(options.status && {
          status: options.status !== undefined ? options.status : true,
        }),
      },
      relations: ['specialist', 'specialization', 'business'],
    });
  }

  async getContractorBookingsSummary(
    options: GetBusinessContractorBookingsDto,
    account: Account
  ) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;

    const qb = this.businessContractorRepository
      .createQueryBuilder("contractor")
      .leftJoin('contractor.specialist', 'specialist')
      .leftJoin('specialist.assignedBookings', 'bookings')
      .leftJoin('specialist.specialization', 'specialization')
      .select([
        'contractor.id as "id"',
        'contractor.role as "role"',
        'specialist.firstName as "firstName"',
        'specialist.lastName as "lastName"',
        'specialist.gender as "gender"',
        'specialist.email as "email"',
        'specialization.title as "specialization"',
        'COUNT(bookings.id) as "totalBookings"'
      ])
      .where('contractor.businessId = :businessId', { businessId })
      .groupBy('contractor.id')
      .addGroupBy('contractor.role')
      .addGroupBy('specialist.id')
      .addGroupBy('specialist.firstName')
      .addGroupBy('specialist.lastName')
      .addGroupBy('specialist.email')
      .addGroupBy('specialist.gender')
      .addGroupBy('specialization.title');

    options.startDate &&
      qb.andWhere(
        "bookings.createdAt >= :startDate",
        { startDate: options.startDate }
      );
    options.endDate &&
      qb.andWhere('bookings.createdAt <= :endDate', { endDate: options.endDate });

    return this.paginate(qb, { ...options, isRaw: true });
  }

  async getContractor(id: number, account: Account) {
    const businessId =
      account.businessContact?.businessId ||
      account.specialist?.contractors[0]?.businessId;
    
    return await this.businessContractorRepository.findOne({
      where: {
        id,
        businessId,
        status: true,
      },
      relations: ['specialist', 'specialization', 'business'],
    });
  }

  async updateContractor(
    id: number,
    dto: UpdateBusinessContractorDto,
    account: Account,
  ) {
    await this.businessContractorRepository.update(
      { id, businessId: account.businessContact?.businessId },
      dto,
    );
  }

  async setupContractor(item: SetupBusinessContractorDto, account: Account) {
    const mAccount = await this.accountRepository.findOne({
      where: { email: item.email },
      relations: ['specialist', 'specialist.contractors'],
    });

    let specialist = mAccount?.specialist;

    if (mAccount?.specialist?.contractors?.length) {
      throw new NotAcceptableException(
        `Contractor's email already linked to a business!`,
      );
    } else if (!specialist) {
      const password = AppUtilities.generateShortCode(9);
      ({ specialist } = await this.accountService.setupAccount({
        password,
        email: item.email,
        userType: AccountTypes.SPECIALIST,
        accountId: mAccount?.id,
        specialist: {
          ...item,
          mobilePhone: item.phoneNumber,
          category: SpecialistCategories.SPECIALIST,
          countryId: item.countryId || account.businessContact.countryId,
        },
      }));

      if (!mAccount) {
        const specialization = await this.specializationRepository.findOne(
          item.specializationId,
        );

        this.mailService.sendContractorAccountSetupEmail({
          name: specialist.firstName,
          businessName: account.businessContact.business.name,
          email: specialist.email,
          password,
          specialization: specialization.title,
        });
      }
    }

    // const isAContractor = (mAccount?.specialist?.contractors || []).find(
    //   (contractor) =>
    //     contractor.businessId === account.businessContact.businessId &&
    //     contractor.specializationId === specialist.specializationId,
    // );
    // if (isAContractor) {
    //   throw new NotAcceptableException('Contractor already set up!');
    // }

    return this.businessContractorRepository.save({
      ...item,
      specialistId: specialist.id,
      businessId: account.businessContact.businessId,
    });
  }

  async inviteContractor(item: SetupBusinessContractorDto, account: Account) {
    //

    return this.businessContractorRepository.save({
      ...item,
      businessId: account.businessContact.businessId,
    });
  }

  async deleteContractor(id: number, account: Account) {
    return await this.businessContractorRepository.update(
      { id, businessId: account.businessContact?.businessId },
      { status: false },
    );
  }
}
