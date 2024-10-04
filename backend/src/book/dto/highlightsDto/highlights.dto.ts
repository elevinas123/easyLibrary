import { IsNumber, IsString } from "class-validator";
<<<<<<< HEAD
import { Highlight } from "src/book/schema/highlights/highlights.schema";

type HighlightType = Highlight;
export class HighlightDto implements HighlightType {
    @IsString() id!: string;

    @IsNumber() startingX!: number;

    @IsNumber() startingY!: number;

    @IsNumber() endX!: number;

    @IsNumber() endY!: number;
=======
import { HighlightType } from "src/book/schema/highlights/highlights.schema";

export class HighlightDto implements HighlightType {
    @IsString() id: string;

    @IsNumber() startingX: number;

    @IsNumber() startingY: number;

    @IsNumber() endX: number;

    @IsNumber() endY: number;
>>>>>>> MongooseBackend
}
