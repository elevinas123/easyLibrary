// src/books/dto/text-element.dto.ts

import { IsEnum, IsNumber, IsString } from "class-validator";
import { CanvaElementSkeletonDto } from "../canvaElementSkeleton.dto";

export class TextElementDto extends CanvaElementSkeletonDto {
    @IsString() @IsEnum(["text"]) type: "text";

    @IsString() text: string;

    @IsString() fontFamily: string;

    @IsNumber() fontSize: number;
}
