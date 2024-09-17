import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";

@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAllBooks() {
        return this.bookService.getAllBooks();
    }
    @Get(":id")
    async getBookById(@Param("id") id: string) {
        return this.bookService.getBookById(id);
    }
    @Post()
    async addBook(@Body() createBookDto: CreateBookDto) {
        return this.bookService.addBook(createBookDto);
    }

    @Put(":id")
    async updateBook(
        @Param("id") id: string,
        @Body() updatedBookDto: CreateBookDto
    ) {
        return this.bookService.updateBook(id, updatedBookDto);
    }
    @Delete(":id")
    async deleteBook(@Param("id") id: string) {
        return this.bookService.deleteBook(id);
    }
}
