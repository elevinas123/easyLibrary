// src/books/dto/arrow-element.dto.ts

import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { CurveElementSkeletonDto } from "../curveElementSkeleton.dto";

export class ArrowElementDto extends CurveElementSkeletonDto {
    @IsString() @IsEnum(["arrow"]) type: "arrow";

    @IsOptional() @IsString() startId: string | null;

    @IsOptional() @IsString() endId: string | null;

    @IsString()
    @IsEnum(["bookText", "text"])
    startType: "bookText" | "text" | null;

    @IsString() @IsEnum(["bookText", "text"]) endType:
        | "bookText"
        | "text"
        | null;
}
