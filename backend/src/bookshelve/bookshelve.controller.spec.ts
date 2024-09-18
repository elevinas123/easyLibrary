import { Test, TestingModule } from '@nestjs/testing';
import { BookshelveController } from './bookshelve.controller';

describe('BookshelveController', () => {
  let controller: BookshelveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookshelveController],
    }).compile();

    controller = module.get<BookshelveController>(BookshelveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
