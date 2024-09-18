import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { BookshelveService } from "./bookshelve.service";
import { CreateBookshelveDto } from "./dto/create-bookshelve.dto";

@Controller("bookshelve")
export class BookshelveController {
    constructor(private readonly bookshelveService: BookshelveService) {}
    @Get()
    async getAllBooks() {
        return this.bookshelveService.getAllBookshelves();
    }
    @Get(":id")
    async getBookById(@Param("id") id: string) {
        return this.bookshelveService.getBookshelveById(id);
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
