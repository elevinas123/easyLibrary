import { Test, TestingModule } from '@nestjs/testing';
import { BookshelveService } from './bookshelve.service';

describe('BookshelveService', () => {
  let service: BookshelveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookshelveService],
    }).compile();

    service = module.get<BookshelveService>(BookshelveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
