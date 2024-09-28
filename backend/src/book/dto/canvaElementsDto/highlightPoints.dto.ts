// src/books/dto/highlight-points.dto.ts

import { IsNumber } from "class-validator";
import { HighlightPoints } from "../../schema/canvaElements/highlightPoints.schema";

type HighlightPointsType = HighlightPoints;

export class HighlightPointsDto implements HighlightPointsType {
    @IsNumber() x!: number;

    @IsNumber() y!: number;
}
