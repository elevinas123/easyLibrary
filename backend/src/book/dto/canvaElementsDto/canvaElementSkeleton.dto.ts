// src/books/dto/canva-element-skeleton.dto.ts

import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { HighlightPointsDto } from "./highlightPoints.dto";

export class CanvaElementSkeletonDto {
    @IsString() fill: string;

    @IsNumber() x: number;

    @IsNumber() y: number;

    @IsNumber() width: number;

    @IsNumber() height: number;

    @IsString() id: string;

    @IsArray() @IsString({ each: true }) outgoingArrowIds: string[];

    @IsArray() @IsString({ each: true }) incomingArrowIds: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HighlightPointsDto)
    points: HighlightPointsDto[];

    @IsString() strokeColor: string;

    @IsNumber() strokeWidth: number;

    @IsNumber() opacity: number;

    @IsNumber() rotation: number;
}
