import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateBookshelveDto {
    @IsString()
    readonly name: string;

    @IsDate()
    @Type(() => Date)
    readonly createdAt: Date;

    @IsArray()
    readonly books: Types.ObjectId[];
}
