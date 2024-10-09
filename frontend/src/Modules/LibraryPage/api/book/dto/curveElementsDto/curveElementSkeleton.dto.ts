// src/books/dto/curve-element-skeleton.dto.ts

import { IsArray, IsNumber, IsOptional, IsString, IsIn } from "class-validator";
import { CurveElementSkeletonType } from "../../schema/curveElements/curveElementSkeleton";

export class CurveElementSkeletonDto implements CurveElementSkeletonType {
    @IsArray() @IsNumber({}, { each: true }) points!: number[];

    @IsString() id!: string;

    @IsString() fill!: string;

    @IsOptional() @IsString() text!: string | null;

    @IsNumber() roughness!: number;

    @IsNumber() bowing!: number;

    @IsNumber() seed!: number;

    @IsNumber() strokeWidth!: number;

    @IsIn(["solid", "dashed", "dotted"]) strokeStyle!:
        | "solid"
        | "dashed"
        | "dotted";

    @IsString() stroke!: string;

    @IsIn([
        "solid",
        "hachure",
        "cross-hatch",
        "zigzag",
        "dots",
        "dashed",
        "zigzag-line",
    ])
    fillStyle!:
        | "solid"
        | "hachure"
        | "cross-hatch"
        | "zigzag"
        | "dots"
        | "dashed"
        | "zigzag-line";

    @IsNumber() fillWeight!: number;

    @IsNumber() hachureAngle!: number;

    @IsNumber() hachureGap!: number;
}
