// src/books/dto/arrow-element.dto.ts

import { IsEnum, IsOptional, IsString } from "class-validator";

import { CurveElementSkeletonDto } from "../curveElementSkeleton.dto";
import {
    ArrowElementType,
    StartType,
} from "../../../schema/curveElements/elements/arrowElement.schema";

export class ArrowElementDto
    extends CurveElementSkeletonDto
    implements ArrowElementType
{
    @IsString() @IsEnum(["arrow"]) type!: "arrow";

    @IsOptional() @IsString() startId!: string | null;

    @IsOptional() @IsString() endId!: string | null;

    @IsString() @IsEnum(["bookText", "text", null]) startType!: StartType;

    @IsString() @IsEnum(["bookText", "text", null]) endType!: StartType;
}
