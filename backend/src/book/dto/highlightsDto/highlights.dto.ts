import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

export class HighlightsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HighlightDto)
    highlights: HighlightDto[];
}

class HighlightDto {
    @IsString() id: string;

    @IsNumber() startingX: number;

    @IsNumber() startingY: number;

    @IsNumber() endX: number;

    @IsNumber() endY: number;
}
