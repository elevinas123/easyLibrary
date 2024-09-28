import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { OffsetPositionDto } from "./offsetPositionDto/offsetPosition.dto";
import { Book } from "../schema/book.schema";
import { HighlightDto } from "./highlightsDto/highlights.dto";

// Infer the types from Book schema

interface CreateBookType
    extends Omit<Book, "canvaElements" | "curveElements" | "_id" | "userId"> {
    canvaElements: (TextElementDto | RectElementDto)[];
    curveElements: ArrowElementDto[];
    _id?: string;
    userId: string;
}

export class CreateBookDto implements CreateBookType {
    @IsString() @IsNotEmpty() @IsOptional() _id?: string;

    @IsString() userId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HighlightDto)
    highlights!: HighlightDto[];

    @IsString() @IsNotEmpty() title!: string;

    @IsString() @IsNotEmpty() description!: string;

    @IsString() @IsNotEmpty() author!: string;

    @IsArray() @IsString({ each: true }) genre!: string[];

    @IsString() @IsNotEmpty() imageUrl!: string;

    @IsBoolean() liked!: boolean;

    @IsDateString() dateAdded!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessedElementDto)
    bookElements!: ProcessedElementDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TextElementDto)
    @Type(() => RectElementDto)
    canvaElements!: (TextElementDto | RectElementDto)[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArrowElementDto)
    curveElements!: ArrowElementDto[];

    @IsNumber() scale!: number;
    @ValidateNested()
    @Type(() => OffsetPositionDto)
    offsetPosition!: OffsetPositionDto;
}
