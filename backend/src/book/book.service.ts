import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Book, BookDocument } from "./schema/book.schema";
import { CreateBookDto } from "./dto/createBookDto";
import { CanvaElementsDto } from "./dto/canvaElementsDto/canvaElements.dto";
import { BookElementsDto } from "./dto/bookElementsDto/bookElements.dto";

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<BookDocument>
    ) {}

    async addBook(createBookDto: CreateBookDto) {
        console.log("adding book");
        const newBook = new this.bookModel(createBookDto);
        return newBook.save();
    }
    async getCanvaElements(id: string) {
        const book = await this.bookModel
            .findById(id)
            .select("canvaElements") // Use projection to fetch only
            // the canvaElements field
            .exec();

        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        return book.canvaElements; // Return only the canvaElements field
    }
    async updatedCanvaElements(canvaElementsDto: CanvaElementsDto, id: string) {
        return await this.bookModel
            .findByIdAndUpdate(
                id,
                {
                    $set: { canvaElements: canvaElementsDto.canvaElements },
                },
                { new: true }
            )
            .exec();
    }

    async updateBookElements(bookElementsDto: BookElementsDto, id: string) {
        return await this.bookModel
            .findByIdAndUpdate(
                id,
                {
                    $set: { bookElements: bookElementsDto.bookElements },
                },
                { new: true }
            )
            .exec();
    }

    async getUserBooks(userId: string): Promise<Book[]> {
        console.log("getting user books", userId);
        return this.bookModel
            .find({ userId: userId })
            .select("-bookElements")
            .exec();
    }

    async getAllBooks(): Promise<Book[]> {
        console.log("getting all books");
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
