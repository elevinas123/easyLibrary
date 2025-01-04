import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { BookSchema } from "./schema/book.schema";

@Module({
    controllers: [BookController],
    providers: [BookService],
    imports: [
        MongooseModule.forFeature([{ name: "Book", schema: BookSchema }]),
    ],
    exports: [BookService],
})
export class BookModule {}
