import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { BookModule } from "src/book/book.module";
import { BookshelveController } from "./bookshelve.controller";
import { BookshelveService } from "./bookshelve.service";
import { Bookshelve } from "./schema/bookshelve-schema";

@Module({
    controllers: [BookshelveController],
    providers: [BookshelveService],
    imports: [
        TypegooseModule.forFeature([Bookshelve]), // Register the Bookshelve model
        BookModule,
    ],
})
export class BookshelveModule {}
