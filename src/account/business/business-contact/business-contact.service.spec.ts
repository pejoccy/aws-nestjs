import { Test, TestingModule } from '@nestjs/testing';
import { BusinessContactService } from './business-contact.service';

describe('BusinessContactService', () => {
  let service: BusinessContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessContactService],
    }).compile();

    service = module.get<BusinessContactService>(BusinessContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
