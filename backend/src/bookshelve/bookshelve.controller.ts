import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { BookshelveService } from "./bookshelve.service";
import { CreateBookshelveDto } from "./dto/create-bookshelve.dto";
import { CreateBookDto } from "src/book/dto/create-book.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("bookshelve")
export class BookshelveController {
    constructor(private readonly bookshelveService: BookshelveService) {}
    @Get()
    async getAllBooks() {
        return this.bookshelveService.getAllBookshelves();
    }
    @Get(":id")
    async getBookById(
        @Param("id") id: string,
        @Param("populate") populate: boolean
    ) {
        if (!populate) {
            return this.bookshelveService.getBookshelveById(id);
        } else {
            return this.bookshelveService.getBookshelveWithPopulatedBooks(id);
        }
    }
    @Post()
    async addBook(@Body() createBookDto: CreateBookshelveDto) {
        return this.bookshelveService.addBookshelve(createBookDto);
    }

    @Put(":id")
    async updateBook(
        @Param("id") id: string,
        @Body() updatedBookDto: CreateBookshelveDto
    ) {
        return this.bookshelveService.updateBookshelve(id, updatedBookDto);
    }
    @Delete(":id")
    async deleteBook(@Param("id") id: string) {
        return this.bookshelveService.deleteBookshelve(id);
    }
    @Post("/createBookInsideBookshelve")
    async addBookToBookshelve(
        @Body("bookshelveId") bookshelveId: string,
        @Body("bookData") bookData: CreateBookDto
    ) {
        return this.bookshelveService.createBookInsideBookshelve(
            bookshelveId,
            bookData
        );
    }
}
