import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { ArrowElementDto } from "./elements/arrowElement.dto";

export class CurveElementsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArrowElementDto) // Currently only ArrowElement
    curveElements: ArrowElementDto[];
}
