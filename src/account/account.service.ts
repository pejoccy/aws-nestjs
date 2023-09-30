import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { BaseService } from '../common/base/service';
import {
  AccountTypes,
  CommsProviders,
  PG_DB_ERROR_CODES,
} from '../common/interfaces';
// import { SubscriptionService } from '../common/subscription/subscription.service';
import { ChimeCommsProvider } from '../comms/providers/chime';
import { Account } from './account.entity';
import { BusinessService } from './business/business.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PatientService } from './patient/patient.service';
import { SpecialistService } from './specialist/specialist.service';
import { AppUtilities } from 'src/app.utilities';
import { ICreateAccount } from './dto/create-account.dto';
import { CreateBusinessContactDto } from './business/business-contact/dto/create-business-contact-dto';
import { CreateBusinessDto } from './business/dto/create-business-dto';

@Injectable()
export class AccountService extends BaseService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private businessService: BusinessService,
    private specialistService: SpecialistService,
    private patientService: PatientService,
    private commsProvider: ChimeCommsProvider, // private subscriptionService: SubscriptionService,
  ) {
    super();
  }

  async setupAccount({
    email,
    password,
    accountId,
    userType,
    business,
    specialist,
    patient,
  }: Omit<
    ICreateAccount & {
      email: string;
      userType: AccountTypes;
      accountId?: number;
      password?: string;
      business?: CreateBusinessDto & { contact: CreateBusinessContactDto };
    },
    'token' | 'otp'
  >) {
    const queryRunner = await this.startTransaction();
    let account, mPatient, mBusiness, mSpecialist;

    try {
      if (!accountId) {
        password = password || AppUtilities.generateShortCode(12);
        const alias = v4();
        // setup Account Comms
        // const identity = await this.commsProvider.createIdentity(alias, email);
        account = await this.accountRepository.save({
          email,
          alias,
          password: await AppUtilities.hashPassword(password),
          type: userType,
          isVerified: true,
          comms: {
            // [CommsProviders.AWS_CHIME]: {
            //   identity: identity.AppInstanceUserArn,
            // },
          },
        });
        accountId = account.id;
      } else {
        account = await this.accountRepository.findOne(accountId);
      }
      // setup default subscription
      // await this.subscriptionService.setupDefaultSubscription(account);
      if (userType === AccountTypes.BUSINESS && !!business) {
        mBusiness = await this.businessService.setup(business, {
          ...business.contact,
          email,
          accountId,
        });
      } else if (userType === AccountTypes.SPECIALIST && !!specialist) {
        mSpecialist = await this.specialistService.setup({
          ...specialist,
          email,
          accountId,
        });
      } else if (userType === AccountTypes.PATIENT && !!patient) {
        mPatient = await this.patientService.create({
          ...patient,
          email,
          accountId,
        });
      } else {
        throw new NotAcceptableException('Invalid user type and data!');
      }

      // clean up
      delete account.password;

      return {
        account,
        business: mBusiness,
        patient: mPatient,
        specialist: mSpecialist,
      };
    } catch (error) {
      if (error.code === PG_DB_ERROR_CODES.CONFLICT) {
        throw new NotAcceptableException(
          'An account with same email already exists!',
        );
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateAccount(id: string, item: UpdateAccountDto) {
    item = this.excludeExtraneousKeys(item);
    const { affected, raw } = await this.accountRepository
      .createQueryBuilder()
      .update(item)
      .where({ id })
      .returning('*')
      .execute();
    if (!affected) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }

    return raw[0];
  }

  public async changePassword(
    userId: string,
    password: string,
  ): Promise<Account> {
    const { affected, raw: [user] = [] } = await this.accountRepository
      .createQueryBuilder()
      .update({ password, isVerified: true })
      .where({ id: userId })
      .returning('*')
      .execute();
    if (!affected) {
      throw new NotAcceptableException('User not found!');
    }

    return user;
  }

  async deleteAccount(id: string) {
    const result = await this.accountRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`user with ${id} not found`);
    }
  }
}
