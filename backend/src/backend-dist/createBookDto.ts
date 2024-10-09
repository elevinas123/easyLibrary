// src/books/dto/create-book.dto.ts

import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { ProcessedElementDto } from "./processedElement.dto";
import { RectElementDto } from "./rectElement.dto";
import { TextElementDto } from "./textElement.dto";
import { ArrowElementDto } from "./arrowElement.dto";
import { OffsetPositionDto } from "./offsetPosition.dto";
import { BookType } from "./book.schema";
import { Types } from "mongoose";
import { HighlightDto } from "./highlights.dto";
import { BookTextElementDto } from "./bookTextElement.dto";
import { CanvaElementType } from "./canvaElementSkeleton.schema";

export class CreateBookDto implements Omit<BookType, "_id"> {
    @IsString() @IsNotEmpty() title: string;

    @IsString()
    @IsNotEmpty()
    userId: Types.ObjectId; // Will be converted to ObjectId in the service

    @IsString() @IsNotEmpty() description: string;

    @IsString() @IsNotEmpty() author: string;

    @IsArray() @IsString({ each: true }) genre: string[];

    @IsString() @IsNotEmpty() imageUrl: string;

    @IsBoolean() liked: boolean;

    @IsDateString() dateAdded: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessedElementDto)
    bookElements: ProcessedElementDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HighlightDto) // First type
    highlights: HighlightDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TextElementDto) // First type
    @Type(() => RectElementDto) // Second type
    @Type(() => BookTextElementDto) // Second type
    canvaElements: CanvaElementType[];
    @IsNumber() scale: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArrowElementDto) // Currently only ArrowElement
    curveElements: ArrowElementDto[];

    @ValidateNested()
    @Type(() => OffsetPositionDto)
    offsetPosition: OffsetPositionDto;
}
