import { Type } from "class-transformer";
import { IsArray, IsDate, IsString } from "class-validator";
import { Types } from "mongoose";
import { BookshelveType } from "../schema/bookshelve-schema";

<<<<<<< HEAD
interface CreateBookshelveDtoType
    extends Omit<CreateBookshelveDto, "_id" | "books"> {
    books: string[];
}

export class CreateBookshelveDto implements CreateBookshelveDtoType {
=======
export class CreateBookshelveDto implements Omit<BookshelveType, "_id"> {
>>>>>>> MongooseBackend
    @IsString()
    readonly name!: string;

    @IsDate()
    @Type(() => Date)
    readonly createdAt!: Date;

    @IsArray()
<<<<<<< HEAD
    readonly books!: string[];
=======
    @Type(() => String)
    readonly books: Types.ObjectId[];
>>>>>>> MongooseBackend
}
