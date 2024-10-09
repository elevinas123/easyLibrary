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
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { OffsetPositionDto } from "./offsetPosition.dto";
import { BookType } from "../schema/book.schema";
import { Types } from "mongoose";
import { HighlightDto } from "./highlightsDto/highlights.dto";
import { BookTextElementDto } from "./canvaElementsDto/elements/bookTextElement.dto";
import { CanvaElementType } from "../schema/canvaElements/canvaElementSkeleton.schema";

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
