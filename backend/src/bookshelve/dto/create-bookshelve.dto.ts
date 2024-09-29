import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

interface CreateBookshelveDtoType
    extends Omit<CreateBookshelveDto, "_id" | "books"> {
    books: string[];
}

export class CreateBookshelveDto implements CreateBookshelveDtoType {
    @IsString()
    readonly name!: string;

    @IsDate()
    @Type(() => Date)
    readonly createdAt!: Date;

    @IsArray()
    readonly books!: string[];
}
