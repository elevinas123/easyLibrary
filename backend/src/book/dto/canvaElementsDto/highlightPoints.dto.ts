// src/books/dto/highlight-points.dto.ts

import { IsNumber } from "class-validator";
<<<<<<< HEAD
import { HighlightPoints } from "../../schema/canvaElements/highlightPoints.schema";

type HighlightPointsType = HighlightPoints;
=======
import { HighlightPointsType } from "src/book/schema/canvaElements/highlights/highlightPoints.schema";

export class HighlightPointsDto implements HighlightPointsType {
    @IsNumber() x: number;
>>>>>>> MongooseBackend

export class HighlightPointsDto implements HighlightPointsType {
    @IsNumber() x!: number;

    @IsNumber() y!: number;
}
