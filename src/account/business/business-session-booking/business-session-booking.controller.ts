import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Account } from '../../account.entity';
import { GetAccount } from '../../../common/decorators/get-user-decorator';
import { PaginationOptionsDto } from '../../../common/dto';
import { EntityIdDto } from '../../../common/dto/entity.dto';
import {
  AccountTypes,
  BusinessContractorRoles,
  imageFileFilter,
} from '../../../common/interfaces';
import { BusinessSessionBookingService } from './business-session-booking.service';
import { CreateBusinessBookingDto } from './dto/create-business-booking-dto';
import { UpdateBusinessBookingDto } from './dto/update-business-booking-dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@ApiBearerAuth()
@ApiTags('Business Bookings')
@Controller('businesses/bookings')
export class BusinessSessionBookingController {
  constructor(private businessBookingService: BusinessSessionBookingService) {}

  @Get()
  async getBookings(
    @Query() dto: PaginationOptionsDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessBookingService.getBookings(dto, account);
  }

  @Get('/:id')
  async getBooking(
    @Param() { id }: EntityIdDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessBookingService.getBooking(id, account);
  }

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: multer.diskStorage({}),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createBooking(
    @Body() dto: CreateBusinessBookingDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.businessBookingService.createBooking(dto, files, account);
  }

  // @Patch('/:id')
  // async updateBranch(
  //   @Param() { id }: EntityIdDto,
  //   @Body() dto: UpdateBusinessBookingDto,
  //   @GetAccount() account: Account,
  // ) {
  //   return this.businessBookingService.updateBooking(id, dto, account);
  // }

  @Delete('/:id')
  async deleteBooking(
    @Param() { id }: EntityIdDto,
    @GetAccount({
      accountTypes: [AccountTypes.BUSINESS],
      roles: [BusinessContractorRoles.PRACTITIONER],
    })
    account: Account,
  ) {
    return this.businessBookingService.deleteBooking(id, account);
  }
}
