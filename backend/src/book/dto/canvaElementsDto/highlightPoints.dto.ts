// src/books/dto/highlight-points.dto.ts

import { IsNumber } from "class-validator";

export class HighlightPointsDto {
    @IsNumber() x: number;

    @IsNumber() y: number;
}
