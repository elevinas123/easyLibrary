import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {CreateBookDto} from 'src/book/dto/createBookDto';
import {BookDocument} from 'src/book/schema/book.schema';

import {BookService} from '../book/book.service';

import {CreateBookshelveDto} from './dto/create-bookshelve.dto';
import {Bookshelve} from './schema/bookshelve-schema';

@Injectable()
export class BookshelveService {
  constructor(
      @InjectModel(Bookshelve.name) private bookshelveModel: Model<Bookshelve>,
      private readonly bookModel: BookService  // Inject BookService
  ) {}
  async addBookshelve(createBookshelveDto: CreateBookshelveDto):
      Promise<Bookshelve> {
    const newBook = new this.bookshelveModel(createBookshelveDto);
    return newBook.save();
  }

  async getAllBookshelves(): Promise<Bookshelve[]> {
    return this.bookshelveModel.find().exec();
  }

  async getBookshelveById(id: string): Promise<Bookshelve> {
    const bookFound = this.bookshelveModel.findById(id).exec();
    if (!bookFound) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return bookFound;
  }
  async updateBookshelve(id: string, updatedBookDto: CreateBookshelveDto):
      Promise<Bookshelve> {
    const updatedBook = await this.bookshelveModel
                            .findByIdAndUpdate(id, updatedBookDto, {new: true})
                            .exec();
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }
  async addBookToBookshelve(bookshelveId: string, bookId: string):
      Promise<Bookshelve> {
    const bookshelve = await this.bookshelveModel.findById(bookshelveId).exec();
    if (!bookshelve) {
      throw new NotFoundException(
          `Bookshelve with ID ${bookshelveId} not found`);
    }
    const bookObjectId = new Types.ObjectId(bookId);

    if (bookshelve.books.includes(bookObjectId)) {
      throw new NotFoundException(
          `Book with ID ${bookId} already exists in the bookshelve`);
    }
    bookshelve.books.push(bookObjectId);
    return bookshelve.save();
  }

  async deleteBookshelve(id: string): Promise<Bookshelve> {
    const deletedBook = this.bookshelveModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return deletedBook;
  }

  async createBookInsideBookshelve(
      bookshelveId: string, bookData: CreateBookDto): Promise<Bookshelve> {
    const book = await this.bookModel.addBook(bookData);
    const bookId = book._id.toString();
    // 2. Add the book's ID to the bookshelf's books array
    return this.addBookToBookshelve(bookshelveId, bookId);
  }
  async getBookshelveWithPopulatedBooks(bookshelveId: string):
      Promise<Bookshelve> {
    return this.bookshelveModel.findById(bookshelveId).populate('books').exec();
  }
}
