import { Module } from "@nestjs/common";
import {TypegooseModule} from 'nestjs-typegoose';  // Import TypegooseModule

import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { Book } from "./schema/book.schema"; // Import the Book model

@Module({
    controllers: [BookController],
    providers: [BookService],
    imports: [
        TypegooseModule.forFeature([Book]), // Use TypegooseModule instead of MongooseModule
    ],
    exports: [BookService],
})
export class BookModule {}
