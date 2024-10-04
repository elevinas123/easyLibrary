import { PartialType } from "@nestjs/mapped-types";
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { CreateBookDto } from "./createBookDto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { HighlightsDto } from "./highlightsDto/highlights.dto";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: ProcessedElementDto[];
    canvaElements?: (TextElementDto | RectElementDto)[];
    curveElements?: ArrowElementDto[];
    highlights?: HighlightsDto["highlights"];
    liked?: boolean;
    scale?: number;
    offsetPosition?: { x: number; y: number };
}
