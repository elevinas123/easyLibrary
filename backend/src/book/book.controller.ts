import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { BookElementsDto, CreateBookDto } from "./dto/create-book.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CanvaElementDto, CanvaElementsDto } from "./dto/elements.dto";
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

    @Put(":id/bookElements")
    async updateBookElements(
        @Body() updateBookElementsDto: BookElementsDto,
        @Param("id") id: string
    ) {
        return this.bookService.updateBookElements(updateBookElementsDto, id);
    }
    @Get(":id/canvaElements")
    async getCanvaElements(@Param("id") id: string) {
        return this.bookService.getCanvaElements(id);
    }
    @Put(":id/canvaElements")
    async updateCanvaElements(
        @Body() canvaElementsDto: CanvaElementsDto,
        @Param("id") id: string
    ) {
        return this.bookService.updatedCanvaElements(canvaElementsDto, id);
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
