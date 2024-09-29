import { PartialType } from "@nestjs/mapped-types";
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { CreateBookDto } from "./createBookDto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { HighlightDto } from "./highlightsDto/highlights.dto";
import { OffsetPosition } from "../schema/offsetPosition.schema";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: ProcessedElementDto[];
    canvaElements?: (TextElementDto | RectElementDto)[];
    curveElements?: ArrowElementDto[];
    highlights?: HighlightDto[];
    liked?: boolean;
    scale?: number;
    offsetPosition?: OffsetPosition;
}
