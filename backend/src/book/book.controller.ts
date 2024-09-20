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
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBooks() {
        return this.bookService.getAllBooks();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getBookById(@Param('id') id: string) {
      return this.bookService.getBookById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async addBook(@Body() createBookDto: CreateBookDto) {
      return this.bookService.addBook(createBookDto);
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateBook(
        @Param('id') id: string, @Body() updatedBookDto: CreateBookDto) {
      return this.bookService.updateBook(id, updatedBookDto);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteBook(@Param('id') id: string) {
      return this.bookService.deleteBook(id);
    }
}
