import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBranchController } from './business-branch.controller';

describe('BusinessBranchController', () => {
  let controller: BusinessBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessBranchController],
    }).compile();

    controller = module.get<BusinessBranchController>(BusinessBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
