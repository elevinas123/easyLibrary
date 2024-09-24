import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { TextElementDto } from "./elements/textElement.dto";
import { RectElementDto } from "./elements/rectElement.dto";

export class CanvaElementsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TextElementDto) // First type
    @Type(() => RectElementDto) // Second type
    canvaElements: (TextElementDto | RectElementDto)[];
}
