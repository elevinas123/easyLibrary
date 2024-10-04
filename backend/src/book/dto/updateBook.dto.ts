import { PartialType } from "@nestjs/mapped-types";
import { CanvaElementType } from "../schema/book.schema";
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { CreateBookDto } from "./createBookDto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { HighlightDto } from "./highlightsDto/highlights.dto";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: ProcessedElementDto[];
    canvaElements?: CanvaElementType[];
    curveElements?: ArrowElementDto[];
    highlights?: HighlightDto[];
    liked?: boolean;
    scale?: number;
    offsetPosition?: { x: number; y: number };
}
