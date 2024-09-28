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
import { OffsetPositionDto } from "./offsetPositionDto/offsetPosition.dto";
import { Book } from "../schema/book.schema";
import { HighlightDto } from "./highlightsDto/highlights.dto";

// Infer the types from Book schema

type CreateBookType = Book;

export class CreateBookDto
    implements Omit<CreateBookType, "canvaElements" | "curveElements">
{
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
