import { Module } from "@nestjs/common";
import { BookshelveController } from "./bookshelve.controller";
import { BookshelveService } from "./bookshelve.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BookshelveSchema } from "./schema/bookshelve-schema";
import { BookModule } from "../book/book.module";

@Module({
    controllers: [BookshelveController],
    providers: [BookshelveService],
    imports: [
        MongooseModule.forFeature([
            { name: "Bookshelve", schema: BookshelveSchema },
        ]),
        BookModule,
    ],
})
export class BookshelveModule {}
