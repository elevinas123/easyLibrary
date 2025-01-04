import { Module } from "@nestjs/common";

import { BookModule } from "../book/book.module";
import { PrismaService } from "../prisma/prisma.service";

import { BookshelveController } from "./bookshelve.controller";
import { BookshelveService } from "./bookshelve.service";

@Module({
    controllers: [BookshelveController],
    providers: [BookshelveService, PrismaService],
    imports: [BookModule],
})
export class BookshelveModule {}
