import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateBookDto } from "./createBookDto";
import { UpdateBookDto } from "./updateBook.dto"; // Import the new DTO
import { Book, BookDocument } from "./book.schema";
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
        return await this.bookModel.find().exec();
    }

    async getUserBooks(userId: string): Promise<Book[]> {
        return await this.bookModel
            .find({ userId })
            .select("-bookElements") // Exclude bookElements if not needed
            .exec();
    }

    async getBookById(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
        console.log("bookGot", book)
        if (!book) {
            console.log("throwing");
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    async updateBook(
        id: string,
        updateBookDto: UpdateBookDto
    ): Promise<Book> {
        const updatedBook = await this.bookModel
            .findByIdAndUpdate(id, { $set: updateBookDto }, { new: true })
            .exec();
        if (!updatedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updatedBook;
    }

    async deleteBook(id: string): Promise<Book> {
        const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
        if (!deletedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return deletedBook;
    }
}
