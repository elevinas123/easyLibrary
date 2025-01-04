import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";

import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/createBookDto";
import { UpdateBookDto } from "./dto/updateBook.dto"; // Import the new DTO
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAllBooks() {
        return this.bookService.getAllBooks();
    }

    @Get("/getUserBooks")
    async getUserBooks(@Query("userId") userId: string) {
        return this.bookService.getUserBooks(userId);
    }

    // Unified update endpoint using PATCH (recommended for partial updates)
    @Patch(":id")
    async updateBook(
        @Param("id") id: string,
        @Body() updateBookDto: UpdateBookDto
    ) {
        return this.bookService.updateBook(id, updateBookDto);
    }

    @Get(":id")
    async getBookById(@Param("id") id: string) {
        console.log("bookGot from things");
        console.log("id", id);
        return this.bookService.getBookById(id);
    }

    @Post()
    async addBook(@Body() createBookDto: CreateBookDto) {
        return this.bookService.addBook(createBookDto);
    }

    @Delete(":id")
    async deleteBook(@Param("id") id: string) {
        return this.bookService.deleteBook(id);
    }
}
