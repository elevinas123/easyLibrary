import { PartialType } from "@nestjs/mapped-types";
import { ProcessedElementDto } from "./bookElementsDto/processedElement.dto";
<<<<<<< HEAD
import { RectElementDto } from "./canvaElementsDto/elements/rectElement.dto";
import { TextElementDto } from "./canvaElementsDto/elements/textElement.dto";
import { CreateBookDto } from "./createBookDto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { HighlightDto } from "./highlightsDto/highlights.dto";
import { OffsetPosition } from "../schema/offsetPosition.schema";
=======
import { CreateBookDto } from "./createBookDto";
import { ArrowElementDto } from "./curveElementsDto/elements/arrowElement.dto";
import { HighlightDto } from "./highlightsDto/highlights.dto";
import { CanvaElementType } from "../schema/canvaElements/canvaElementSkeleton.schema";
>>>>>>> MongooseBackend

export class UpdateBookDto extends PartialType(CreateBookDto) {
    bookElements?: ProcessedElementDto[];
    canvaElements?: CanvaElementType[];
    curveElements?: ArrowElementDto[];
    highlights?: HighlightDto[];
    liked?: boolean;
    scale?: number;
    offsetPosition?: OffsetPosition;
}
