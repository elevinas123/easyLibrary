// src/books/dto/rect-element.dto.ts

import { IsEnum, IsNumber, IsString } from "class-validator";
import { CanvaElementSkeletonDto } from "../canvaElementSkeleton.dto";

export class RectElementDto extends CanvaElementSkeletonDto {
    @IsString() @IsEnum(["rect"]) type: "rect";

    @IsNumber() roughness: number;

    @IsNumber() seed: number;

    @IsString() fillStyle: string;

    @IsNumber() hachureGap: number;

    @IsNumber() hachureAngle: number;
}
