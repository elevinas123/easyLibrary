import { BookElementsDto } from "./bookElementsDto/bookElements.dto";
import { CanvaElementsDto } from "./canvaElementsDto/canvaElements.dto";
import { CreateBookDto } from "./createBookDto";
import { CurveElementsDto } from "./curveElementsDto/curveElements.dto";
import { HighlightsDto } from "./highlightsDto/highlights.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: BookElementsDto;
    canvaElements?: CanvaElementsDto;
    curveElements?: CurveElementsDto;
    highlights?: HighlightsDto["highlights"];
    liked?: boolean;
    scale?: number;
    offsetPosition?: { x: number; y: number };
}
