import { Test, TestingModule } from '@nestjs/testing';
import { BusinessContactController } from './business-contact.controller';

describe('BusinessContactController', () => {
  let controller: BusinessContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessContactController],
    }).compile();

    controller = module.get<BusinessContactController>(BusinessContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
