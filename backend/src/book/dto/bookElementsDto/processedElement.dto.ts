// processedElement.dto.ts
import { IsNumber, IsString } from "class-validator";
import { ProcessedElement } from "../../schema/bookElements/processedElement.schema";

type ProcessedElementType = ProcessedElement;
export class ProcessedElementDto implements ProcessedElementType {
    @IsString() text!: string;

    @IsNumber() lineX!: number;

    @IsNumber() lineWidth!: number;

    @IsNumber() lineY!: number;
}
