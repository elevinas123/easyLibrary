<<<<<<< HEAD
import { prop } from "@typegoose/typegoose";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

import { CanvaElementSkeleton } from "src/book/schema/canvaElements/canvaElementSkeleton";
import { HighlightPointsDto } from "./highlightPoints.dto";

// DTO Class with Typegoose for MongoDB schema
export class CanvaElementSkeletonDto implements CanvaElementSkeleton {
    @IsString() @prop({ type: String, required: true }) public fill!: string;

    @IsNumber() @prop({ type: Number, required: true }) public x!: number;

    @IsNumber() @prop({ type: Number, required: true }) public y!: number;

    @IsNumber() @prop({ type: Number, required: true }) public width!: number;

    @IsNumber() @prop({ type: Number, required: true }) public height!: number;

    @IsString() @prop({ type: String, required: true }) public id!: string;

    @IsArray()
    @IsString({ each: true })
    @prop({ type: [String], required: true })
    public outgoingArrowIds!: string[];

    @IsArray()
    @IsString({ each: true })
    @prop({ type: [String], required: true })
    public incomingArrowIds!: string[];
=======
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import {
    CanvaElementSkeletonType
} from "src/book/schema/canvaElements/canvaElementSkeleton.schema";

import { HighlightPointsDto } from "./highlightPoints.dto";

// DTO Class with Typegoose for MongoDB schema
export class CanvaElementSkeletonDto implements CanvaElementSkeletonType {
    @IsString() public fill!: string;

    @IsNumber() public x!: number;

    @IsNumber() public y!: number;

    @IsNumber() public width!: number;

    @IsNumber() public height!: number;

    @IsString() public id!: string;

    @IsArray() @IsString({ each: true }) public outgoingArrowIds!: string[];

    @IsArray() @IsString({ each: true }) public incomingArrowIds!: string[];
>>>>>>> MongooseBackend

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HighlightPointsDto)
<<<<<<< HEAD
    @prop({ type: () => [HighlightPointsDto], required: true })
    public points!: HighlightPointsDto[];

    @IsString()
    @prop({ type: String, required: true })
    public strokeColor!: string;

    @IsNumber()
    @prop({ type: Number, required: true })
    public strokeWidth!: number;

    @IsNumber() @prop({ type: Number, required: true }) public opacity!: number;

    @IsNumber()
    @prop({ type: Number, required: true })
    public rotation!: number
=======
    public points!: HighlightPointsDto[];

    @IsString() public strokeColor!: string;

    @IsNumber() public strokeWidth!: number;

    @IsNumber() public opacity!: number;

    @IsNumber() public rotation!: number;
>>>>>>> MongooseBackend
}
