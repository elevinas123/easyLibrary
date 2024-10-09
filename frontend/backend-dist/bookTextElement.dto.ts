// src/books/dto/rect-element.dto.ts

import { IsEnum, IsNumber, IsString } from "class-validator";

import { BookTextElementType } from "./bookTextElement.schema";
import { CanvaElementSkeletonDto } from "./canvaElementSkeleton.dto";

export class BookTextElementDto
    extends CanvaElementSkeletonDto
    implements BookTextElementType
{
    @IsString() @IsEnum(["bookText"]) type: "bookText";

    @IsString() text: string;

    @IsNumber() fontSize: number;

    @IsString() fontFamily: string;
}
