import { IsNumber } from "class-validator";
import { OffsetPositionType } from "../schema/offsetPosition/offsetPosition.schema";

export class OffsetPositionDto implements OffsetPositionType {
    @IsNumber() x: number;
    @IsNumber() y: number;
}
