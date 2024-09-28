// src/books/dto/rect-element.dto.ts

import { IsEnum, IsNumber, IsString } from "class-validator";
import { RectElement } from "src/book/schema/canvaElements/elements/rectElement.schema";
import { CanvaElementSkeletonDto } from "../canvaElementSkeleton.dto";

type RectElementType = RectElement

export class RectElementDto
    extends CanvaElementSkeletonDto
    implements RectElementType
{
    @IsString() @IsEnum(["rect"]) type!: "rect";

    @IsNumber() roughness!: number;

    @IsNumber() seed!: number;

    @IsString() fillStyle!: string;

    @IsNumber() hachureGap!: number;

    @IsNumber() hachureAngle!: number;
}
