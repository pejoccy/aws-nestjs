import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSessionBookingController } from './business-session-booking.controller';

describe('BusinessSessionBookingController', () => {
  let controller: BusinessSessionBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessSessionBookingController],
    }).compile();

    controller = module.get<BusinessSessionBookingController>(
      BusinessSessionBookingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
