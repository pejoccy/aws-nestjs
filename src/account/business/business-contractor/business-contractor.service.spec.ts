import { Test, TestingModule } from '@nestjs/testing';
import { BusinessContractorService } from './business-contractor.service';

describe('BusinessContractorService', () => {
  let service: BusinessContractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessContractorService],
    }).compile();

    service = module.get<BusinessContractorService>(BusinessContractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
