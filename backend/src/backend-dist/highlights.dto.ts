import { IsNumber, IsString } from "class-validator";
import { HighlightType } from "./highlights.schema";

export class HighlightDto implements HighlightType {
    @IsString() id!: string;

    @IsNumber() startingX!: number;

    @IsNumber() startingY!: number;

    @IsNumber() endX!: number;

    @IsNumber() endY!: number;
}
