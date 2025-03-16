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
import { Prisma } from "@prisma/client"; // Import Prisma types

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { BookService } from "./book.service";

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

    @Get("/getCurrentlyReading")
    async getCurrentlyReading(@Query("userId") userId: string) {
        return this.bookService.getCurrentlyReading(userId);
    }

    @Patch(":id")
    async updateBook(
        @Param("id") id: string,
        @Body() data: Prisma.BookUpdateInput
    ) {
        return this.bookService.updateBook(id, data);
    }

    @Get(":id")
    async getBookById(@Param("id") id: string) {
        return this.bookService.getBookById(id);
    }

    @Post()
    async addBook(@Body() data: Prisma.BookCreateInput) {
        return this.bookService.addBook(data);
    }

    @Delete(":id")
    async deleteBook(@Param("id") id: string) {
        return this.bookService.deleteBook(id);
    }
}
