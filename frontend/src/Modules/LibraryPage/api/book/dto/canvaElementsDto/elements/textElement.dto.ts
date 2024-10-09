// src/books/dto/text-element.dto.ts

import { IsEnum, IsNumber, IsString } from "class-validator";
import { CanvaElementSkeletonDto } from "../canvaElementSkeleton.dto";
import { TextElementType } from "../../../schema/canvaElements/elements/textElement.schema";
export class TextElementDto
    extends CanvaElementSkeletonDto
    implements TextElementType
{
    @IsString() @IsEnum(["text"]) type!: "text";

    @IsString() text!: string;

    @IsString() fontFamily!: string;

    @IsNumber() fontSize!: number;
}
