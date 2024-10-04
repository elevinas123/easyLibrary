// src/books/dto/text-element.dto.ts

import { IsEnum, IsNumber, IsString } from "class-validator";
import { CanvaElementSkeletonDto } from "../canvaElementSkeleton.dto";
<<<<<<< HEAD
import { TextElement } from "src/book/schema/canvaElements/elements/textElement.schema";

type TextElementType = TextElement;
=======
import { TextElementType } from "src/book/schema/canvaElements/elements/textElement.schema";

>>>>>>> MongooseBackend
export class TextElementDto
    extends CanvaElementSkeletonDto
    implements TextElementType
{
<<<<<<< HEAD
    @IsString() @IsEnum(["text"]) type!: "text";
=======
    @IsString() @IsEnum(["text"]) type: "text";
>>>>>>> MongooseBackend

    @IsString() text!: string;

    @IsString() fontFamily!: string;

    @IsNumber() fontSize!: number;
}
