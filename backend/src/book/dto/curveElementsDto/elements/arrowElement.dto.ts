// src/books/dto/arrow-element.dto.ts

import { IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { CurveElementSkeletonDto } from "../curveElementSkeleton.dto";
import { ArrowElement } from "src/book/schema/curveElements/elements/arrowElement.schema";
export type StartType = "bookText" | "text" | null;

type ArrowElementType = ArrowElement;
export class ArrowElementDto
    extends CurveElementSkeletonDto
    implements ArrowElementType
{
    @IsString() @IsEnum(["arrow"]) type: "arrow";

    @IsOptional() @IsString() startId!: string | null;

    @IsString() @IsEnum(["bookText", "text", null]) startType: StartType;

    @IsString() @IsEnum(["bookText", "text", null]) endType: StartType;
}
