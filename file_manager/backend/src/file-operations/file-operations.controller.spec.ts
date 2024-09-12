import { Test, TestingModule } from '@nestjs/testing';
import { FileOperationsController } from './file-operations.controller';
import { FileOperationsService } from './file-operations.service';

describe('FileOperationsController', () => {
  let controller: FileOperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileOperationsController],
      providers: [FileOperationsService],
    }).compile();

    controller = module.get<FileOperationsController>(FileOperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
