import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsMongoId,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Types } from "mongoose";

class ProcessedElementDto {
    @IsString() text: string;

    @IsNumber() lineX: number;

    @IsNumber() lineWidth: number;

    @IsNumber() lineY: number;
}

export class BookElementsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessedElementDto)
    bookElements: ProcessedElementDto[];
}

export class CreateBookDto {
    @IsString() title: string;

    @IsMongoId() userId: Types.ObjectId;

    @IsString() description: string;

    @IsString() author: string;

    @IsArray() @IsString({ each: true }) genre: string[];

    @IsString() imageUrl: string;

    @IsBoolean() liked: boolean;

    @IsDate() @Type(() => Date) dateAdded: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessedElementDto)
    bookElements: ProcessedElementDto[];

    
}
