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
import { CurveElementsDto } from "./curveElementsDto/curveElements.dto";
import { CanvaElementsDto } from "./canvaElementsDto/canvaElements.dto";
import { BookElementsDto } from "./bookElementsDto/bookElements.dto";
import { OffsetPositionDto } from "../schema/offsetPosition/offsetPosition.dto";
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";

export class CreateBookDto {
    @IsString() @IsNotEmpty() title: string;

    @IsString()
    @IsNotEmpty()
    userId: string; // Will be converted to ObjectId in the service

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
    @Type(() => TextElementDto) // First type
    @Type(() => RectElementDto) // Second type
    canvaElements: (TextElementDto | RectElementDto)[];
    @IsNumber() scale: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArrowElementDto) // Currently only ArrowElement
    curveElements: ArrowElementDto[];

    @ValidateNested()
    @Type(() => OffsetPositionDto)
    offsetPosition: OffsetPositionDto;
}
