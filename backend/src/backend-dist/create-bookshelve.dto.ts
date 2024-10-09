import { Type } from "class-transformer";
import { IsArray, IsDate, IsString } from "class-validator";
import { Types } from "mongoose";
import { BookshelveType } from "./bookshelve-schema";

export class CreateBookshelveDto implements Omit<BookshelveType, "_id"> {
    @IsString()
    readonly name!: string;

    @IsDate()
    @Type(() => Date)
    readonly createdAt!: Date;

    @IsArray()
    @Type(() => String)
    readonly books!: Types.ObjectId[];
}
