import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

import { HighlightPointsDto } from "./highlightPoints.dto";
import { CanvaElementSkeleton, CanvaElementSkeletonType } from "src/book/schema/canvaElements/canvaElementSkeleton";

// DTO Class with Typegoose for MongoDB schema
export class CanvaElementSkeletonDto implements CanvaElementSkeletonType {
    @IsString() public fill!: string;

    @IsNumber() public x!: number;

    @IsNumber() public y!: number;

    @IsNumber() public width!: number;

    @IsNumber() public height!: number;

    @IsString() public id!: string;

    @IsArray()
    @IsString({ each: true })
    public outgoingArrowIds!: string[];

    @IsArray()
    @IsString({ each: true })
    public incomingArrowIds!: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HighlightPointsDto)
    public points!: HighlightPointsDto[];

    @IsString() public strokeColor!: string;

    @IsNumber() public strokeWidth!: number;

    @IsNumber() public opacity!: number;

    @IsNumber() public rotation!: number;
}
