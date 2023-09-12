import { Test, TestingModule } from '@nestjs/testing';
import { BusinessContractorController } from './business-contractor.controller';

describe('BusinessContractorController', () => {
  let controller: BusinessContractorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessContractorController],
    }).compile();

    controller = module.get<BusinessContractorController>(
      BusinessContractorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
