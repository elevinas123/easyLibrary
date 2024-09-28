import { IsArray, IsMongoId, IsNumber, IsString, Min } from "class-validator";
import { User } from "../schemas/user.schema";
import { Bookshelve } from "src/bookshelve/schema/bookshelve-schema";
import { Ref } from "@typegoose/typegoose";
import { Book } from "src/book/schema/book.schema";

type CreateUserDtoType = Omit<User, "_id">;

export class CreateUserDto implements CreateUserDtoType {
    @IsString() readonly username: string;

    @IsString() readonly password: string;

    @IsNumber() @Min(0) readonly age: number;

    @IsString() readonly comment: string;

    // Books array that must contain valid MongoDB ObjectId references
    @IsArray()
    @IsMongoId({ each: true })
    // Validate each item in the array as a valid ObjectId
    readonly books: Ref<Book>[]; // Required, but can be an empty array

    // Bookshelves array that must contain valid MongoDB ObjectId references
    @IsArray()
    @IsMongoId({ each: true })
    // Validate each item in the array as a valid ObjectId
    readonly bookshelves: Ref<Bookshelve>[]; // Required, but can be an empty array
}
