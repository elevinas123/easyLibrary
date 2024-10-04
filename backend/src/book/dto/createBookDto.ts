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
<<<<<<< HEAD

=======
>>>>>>> MongooseBackend
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
<<<<<<< HEAD
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
=======
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
>>>>>>> MongooseBackend

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
<<<<<<< HEAD
    @Type(() => TextElementDto)
    @Type(() => RectElementDto)
    canvaElements!: (TextElementDto | RectElementDto)[];
=======
    @Type(() => HighlightDto) // First type
    highlights: HighlightDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TextElementDto) // First type
    @Type(() => RectElementDto) // Second type
    @Type(() => BookTextElementDto) // Second type
    canvaElements: CanvaElementType[];
    @IsNumber() scale: number;
>>>>>>> MongooseBackend

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArrowElementDto)
    curveElements!: ArrowElementDto[];

    @IsNumber() scale!: number;

    @Type(() => OffsetPositionDto)
    offsetPosition!: OffsetPositionDto;
}
