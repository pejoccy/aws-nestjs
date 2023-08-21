import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBranchService } from './business-branch.service';

describe('BusinessBranchService', () => {
  let service: BusinessBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBranchService],
    }).compile();

    service = module.get<BusinessBranchService>(BusinessBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
