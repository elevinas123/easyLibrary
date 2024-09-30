import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { BookshelveModule } from "src/bookshelve/bookshelve.module";
import { BookModule } from "src/book/book.module";

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [
        TypegooseModule.forFeature([User]),
        JwtModule,
        forwardRef(() => BookModule),
        forwardRef(() => BookshelveModule),
    ],
    exports: [UserService],
})
export class UserModule {}
