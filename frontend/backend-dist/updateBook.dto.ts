import { PartialType } from "@nestjs/mapped-types";
import { ProcessedElementDto } from "./processedElement.dto";
import { CreateBookDto } from "./createBookDto";
import { ArrowElementDto } from "./arrowElement.dto";
import { HighlightDto } from "./highlights.dto";
import { CanvaElementType } from "./canvaElementSkeleton.schema";

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: ProcessedElementDto[];
    canvaElements?: CanvaElementType[];
    curveElements?: ArrowElementDto[];
    highlights?: HighlightDto[];
    liked?: boolean;
    scale?: number;
    offsetPosition?: { x: number; y: number };
}
