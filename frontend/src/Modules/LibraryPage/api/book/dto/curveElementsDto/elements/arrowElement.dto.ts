// src/books/dto/arrow-element.dto.ts

import {
    IsEnum,
    IsOptional,
    IsString
} from "class-validator";
import {
    ArrowElementType,
    StartType,
} from "src/book/schema/curveElements/elements/arrowElement.schema";
import { CurveElementSkeletonDto } from "../curveElementSkeleton.dto";

export class ArrowElementDto
    extends CurveElementSkeletonDto
    implements ArrowElementType
{
    @IsString() @IsEnum(["arrow"]) type: "arrow";

    @IsOptional() @IsString() startId: string | null;

    @IsOptional() @IsString() endId: string | null;

    @IsString() @IsEnum(["bookText", "text", null]) startType: StartType;

    @IsString() @IsEnum(["bookText", "text", null]) endType: StartType;
}
