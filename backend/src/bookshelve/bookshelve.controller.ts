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
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("bookshelve")
export class BookshelveController {
    constructor(private readonly bookshelveService: BookshelveService) {}
    @Get()
    async getAllBooks() {
        return this.bookshelveService.getAllBookshelves();
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
}
