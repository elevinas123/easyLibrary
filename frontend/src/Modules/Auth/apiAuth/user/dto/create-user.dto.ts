import { IsArray, IsMongoId, IsNumber, IsString, Min } from "class-validator";
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
}
