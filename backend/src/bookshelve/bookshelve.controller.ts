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
import { Prisma } from "@prisma/client";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { BookshelveService } from "./bookshelve.service";

@UseGuards(JwtAuthGuard)
@Controller("bookshelve")
export class BookshelveController {
    constructor(private readonly bookshelveService: BookshelveService) {}

    @Get()
    async getAllBooks() {
        return this.bookshelveService.getAllBookshelves();
    }

    @Post()
    async addBookshelve(@Body() data: Prisma.BookshelveCreateInput) {
        return this.bookshelveService.addBookshelve(data);
    }

    @Put(":id")
    async updateBookshelve(
        @Param("id") id: string,
        @Body() data: Prisma.BookshelveUpdateInput
    ) {
        return this.bookshelveService.updateBookshelve(id, data);
    }

    @Post(":bookshelveId/books/:bookId")
    async addBookToBookshelve(
        @Param("bookshelveId") bookshelveId: string,
        @Param("bookId") bookId: string
    ) {
        return this.bookshelveService.addBookToBookshelve(bookshelveId, bookId);
    }

    @Delete(":id")
    async deleteBookshelve(@Param("id") id: string) {
        return this.bookshelveService.deleteBookshelve(id);
    }
}
