// processedElement.dto.ts
import { IsNumber, IsString } from "class-validator";
<<<<<<< HEAD
import { ProcessedElement } from "../../schema/bookElements/processedElement.schema";

type ProcessedElementType = ProcessedElement;
export class ProcessedElementDto implements ProcessedElementType {
    @IsString() text!: string;

    @IsNumber() lineX!: number;

    @IsNumber() lineWidth!: number;

    @IsNumber() lineY!: number;
=======
import { ProcessedElementType } from "src/book/schema/bookElements/processedElement.schema";

export class ProcessedElementDto implements ProcessedElementType {
    @IsString() text: string;

    @IsNumber() lineX: number;

    @IsNumber() lineWidth: number;

    @IsNumber() lineY: number;
>>>>>>> MongooseBackend
}
