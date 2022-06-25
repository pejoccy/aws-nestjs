import { Test, TestingModule } from '@nestjs/testing';
import { SpecializationController } from './specialization.controller';

describe('SpecializationController', () => {
  let controller: SpecializationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecializationController],
    }).compile();

    controller = module.get<SpecializationController>(SpecializationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
