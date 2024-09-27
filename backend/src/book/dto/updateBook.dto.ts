import { BookElementsDto } from "./bookElementsDto/bookElements.dto";
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { CanvaElementsDto } from "./canvaElementsDto/canvaElements.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { CreateBookDto } from "./createBookDto";
import { CurveElementsDto } from "./curveElementsDto/curveElements.dto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { HighlightsDto } from "./highlightsDto/highlights.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: ProcessedElementDto[];
    canvaElements?: (TextElementDto | RectElementDto)[];
    curveElements?: ArrowElementDto[];
    highlights?: HighlightsDto["highlights"];
    liked?: boolean;
    scale?: number;
    offsetPosition?: { x: number; y: number };
}
