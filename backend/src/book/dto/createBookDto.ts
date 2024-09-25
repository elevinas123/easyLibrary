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

    @ValidateNested()
    @Type(() => BookElementsDto)
    bookElements: BookElementsDto;

    @ValidateNested()
    @Type(() => CanvaElementsDto)
    canvaElements: CanvaElementsDto;

    @ValidateNested()
    @Type(() => CurveElementsDto)
    curveElements: CurveElementsDto;

    @IsNumber() scale: number;

    @ValidateNested()
    @Type(() => OffsetPositionDto)
    offsetPosition: OffsetPositionDto;
}
