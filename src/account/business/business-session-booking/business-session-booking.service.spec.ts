import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSessionBookingService } from './business-session-booking.service';

describe('BusinessSessionBookingService', () => {
  let service: BusinessSessionBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSessionBookingService],
    }).compile();

    service = module.get<BusinessSessionBookingService>(
      BusinessSessionBookingService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
