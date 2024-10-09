// src/books/dto/highlight-points.dto.ts

import { IsNumber } from "class-validator";
import { HighlightPointsType } from "../../schema/canvaElements/highlights/highlightPoints.schema";

export class HighlightPointsDto implements HighlightPointsType {
    @IsNumber() x!: number;

    @IsNumber() y!: number;
}
