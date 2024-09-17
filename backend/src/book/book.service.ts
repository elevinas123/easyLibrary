import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Book, BookDocument } from "./schema/book.schema";
import { Model } from "mongoose";
import { CreateBookDto } from "./dto/create-book.dto";

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<BookDocument>
    ) {}

    async addBook(createBookDto: CreateBookDto): Promise<Book> {
        const newBook = new this.bookModel(createBookDto);
        return newBook.save();
    }

    async getAllBooks(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    async getBookById(id: string): Promise<Book> {
        const bookFound = this.bookModel.findById(id).exec();
        if (!bookFound) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return bookFound;
    }
    async updateBook(id: string, updatedBookDto: CreateBookDto): Promise<Book> {
        const updatedBook = await this.bookModel
            .findByIdAndUpdate(id, updatedBookDto, { new: true })
            .exec();
        if (!updatedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updatedBook;
    }

    async deleteBook(id: string): Promise<Book> {
        const deletedBook = this.bookModel.findByIdAndDelete(id).exec();
        if (!deletedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return deletedBook;
    }
}
