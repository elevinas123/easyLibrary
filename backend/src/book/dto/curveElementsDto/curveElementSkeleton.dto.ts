// src/books/dto/curve-element-skeleton.dto.ts

import { IsArray, IsNumber, IsOptional, IsString, IsIn } from "class-validator";
<<<<<<< HEAD
import { CurveElementSkeleton } from "../../schema/curveElements/curveElementSkeleton";

type CurveElementSkeletonType = CurveElementSkeleton;
export class CurveElementSkeletonDto implements CurveElementSkeletonType {
    @IsArray() @IsNumber({}, { each: true }) points!: number[];
=======
import { CurveElementSkeletonType } from "src/book/schema/curveElements/curveElementSkeleton";

export class CurveElementSkeletonDto implements CurveElementSkeletonType {
    @IsArray() @IsNumber({}, { each: true }) points: number[];
>>>>>>> MongooseBackend

    @IsString() id!: string;

    @IsString() fill!: string;

    @IsOptional() @IsString() text?: string | null;

    @IsNumber() roughness!: number;

    @IsNumber() bowing!: number;

    @IsNumber() seed!: number;

    @IsNumber() strokeWidth!: number;

<<<<<<< HEAD
    @IsIn(["solid", "dashed", "dotted"]) strokeStyle!:
=======
    @IsIn(["solid", "dashed", "dotted"]) strokeStyle:
>>>>>>> MongooseBackend
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
<<<<<<< HEAD
    fillStyle!:
=======
    fillStyle:
>>>>>>> MongooseBackend
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
