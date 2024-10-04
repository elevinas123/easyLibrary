import { Injectable, NotFoundException } from "@nestjs/common";
<<<<<<< HEAD
import { Model, Types } from "mongoose";

import { BookService } from "../book/book.service";

import { CreateBookshelveDto } from "./dto/create-bookshelve.dto";
import { Bookshelve } from "./schema/bookshelve-schema";
import { InjectModel } from "nestjs-typegoose";
=======
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";


import { CreateBookshelveDto } from "./dto/create-bookshelve.dto";
import { Bookshelve } from "./schema/bookshelve-schema";
>>>>>>> MongooseBackend

@Injectable()
export class BookshelveService {
    constructor(
<<<<<<< HEAD
        @InjectModel(Bookshelve)
        private bookshelveModel: Model<Bookshelve>,
        private readonly bookModel: BookService // Inject BookService
=======
        @InjectModel(Bookshelve.name)
        private bookshelveModel: Model<Bookshelve>,
>>>>>>> MongooseBackend
    ) {}
    async addBookshelve(
        createBookshelveDto: CreateBookshelveDto
    ): Promise<Bookshelve> {
        const newBook = new this.bookshelveModel(createBookshelveDto);
        return newBook.save();
    }

    async getAllBookshelves(): Promise<Bookshelve[]> {
<<<<<<< HEAD
        return await this.bookshelveModel.find().exec();
=======
        return this.bookshelveModel.find().exec();
>>>>>>> MongooseBackend
    }

    async getBookshelveById(id: string): Promise<Bookshelve> {
        const bookFound = await this.bookshelveModel.findById(id).exec();
        if (!bookFound) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return bookFound;
    }
    async updateBookshelve(
        id: string,
        updatedBookDto: CreateBookshelveDto
    ): Promise<Bookshelve> {
        const updatedBook = await this.bookshelveModel
            .findByIdAndUpdate(id, updatedBookDto, { new: true })
            .exec();
        if (!updatedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updatedBook;
    }
    async addBookToBookshelve(
        bookshelveId: string,
        bookId: string
    ): Promise<Bookshelve> {
        const bookshelve = await this.bookshelveModel
            .findById(bookshelveId)
            .exec();
        if (!bookshelve) {
            throw new NotFoundException(
                `Bookshelve with ID ${bookshelveId} not found`
            );
        }
        const bookObjectId = new Types.ObjectId(bookId);

        if (bookshelve.books.includes(bookObjectId)) {
            throw new NotFoundException(
                `Book with ID ${bookId} already exists in the bookshelve`
            );
        }
        bookshelve.books.push(bookObjectId);
        return bookshelve.save();
    }

    async deleteBookshelve(id: string): Promise<Bookshelve> {
        const deletedBook = await this.bookshelveModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return deletedBook;
    }
}
