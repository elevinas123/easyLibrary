import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

type CreateBookshelveDtoType = Omit<CreateBookshelveDto, "_id">;

export class CreateBookshelveDto implements CreateBookshelveDtoType {
    @IsString()
    readonly name!: string;

    @IsDate()
    @Type(() => Date)
    readonly createdAt!: Date;

    @IsArray()
    readonly books!: Types.ObjectId[];
}
