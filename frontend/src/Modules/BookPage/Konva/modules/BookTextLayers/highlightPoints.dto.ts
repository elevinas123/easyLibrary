// src/books/dto/highlight-points.dto.ts

import { IsNumber } from "class-validator";
import { HighlightPointsType } from "./highlightPoints.schema";

export class HighlightPointsDto implements HighlightPointsType {
    @IsNumber() x!: number;

    @IsNumber() y!: number;
}
