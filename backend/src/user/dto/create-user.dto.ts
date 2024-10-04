import { IsArray, IsMongoId, IsNumber, IsString, Min } from "class-validator";
<<<<<<< HEAD
import { User } from "../schemas/user.schema";
import { Bookshelve } from "src/bookshelve/schema/bookshelve-schema";
import { Ref } from "@typegoose/typegoose";
import { Book } from "src/book/schema/book.schema";

interface CreateUserDtoType
    extends Omit<User, "_id" | "books" | "bookshelves"> {
    books: string[];
    bookshelves: string[];
}
export class CreateUserDto implements CreateUserDtoType {
    @IsString() readonly username!: string;

    @IsString() readonly password!: string;

    @IsNumber() @Min(0) readonly age!: number;

    @IsString() readonly comment!: string;

    // Books array that must contain valid MongoDB ObjectId references
    @IsArray()
    @IsString({ each: true })
    // Validate each item in the array as a valid ObjectId
    readonly books!: string[]; // Required, but can be an empty array

    // Bookshelves array that must contain valid MongoDB ObjectId references
    @IsArray()
    @IsString({ each: true })
    // Validate each item in the array as a valid ObjectId
    readonly bookshelves!: string[]; // Required, but can be an empty array
=======
import { UserType } from "../schemas/user.schema";
import { Types } from "mongoose";

export class CreateUserDto implements Omit<UserType, "_id"> {
    @IsString() readonly username: string;

    @IsString() readonly password: string;

    @IsNumber() @Min(0) readonly age: number;

    @IsString() readonly comment: string;

    // Books array that must contain valid MongoDB ObjectId references
    @IsArray()
    @IsMongoId({ each: true })
    // Validate each item in the array as a valid ObjectId
    readonly books: Types.ObjectId[]; // Required, but can be an empty array

    // Bookshelves array that must contain valid MongoDB ObjectId references
    @IsArray()
    @IsMongoId({ each: true })
    // Validate each item in the array as a valid ObjectId
    readonly bookshelves: Types.ObjectId[]; // Required, but can be an empty array
>>>>>>> MongooseBackend
}
