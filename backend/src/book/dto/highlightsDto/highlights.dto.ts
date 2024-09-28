import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { Highlight } from "src/book/schema/highlights/highlights.schema";

type HighlightType = Highlight;
export class HighlightDto implements HighlightType {
    @IsString() id: string;

    @IsNumber() startingX: number;

    @IsNumber() startingY: number;

    @IsNumber() endX: number;

    @IsNumber() endY: number;
}
