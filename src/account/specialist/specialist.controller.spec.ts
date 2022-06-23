import { Test, TestingModule } from '@nestjs/testing';
import { SpecialistController } from './specialist.controller';

describe('SpecialistController', () => {
  let controller: SpecialistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialistController],
    }).compile();

    controller = module.get<SpecialistController>(SpecialistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
