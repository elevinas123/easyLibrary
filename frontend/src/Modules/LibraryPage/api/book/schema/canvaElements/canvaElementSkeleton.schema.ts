// canva-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    HighlightPointsSchema,
    HighlightPointsType,
} from "./highlights/highlightPoints.schema";
import { RectElementType } from "./elements/rectElement.schema";
import { TextElementType } from "./elements/textElement.schema";
import { BookTextElementType } from "./elements/bookTextElement.schema";

export type CanvaElementSkeletonType = {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
    outgoingArrowIds: string[];
    incomingArrowIds: string[];
    points: HighlightPointsType[];
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
};
export type CanvaElementType =
    | RectElementType
    | TextElementType
    | BookTextElementType;
@Schema({ discriminatorKey: "type", _id: false })
export class CanvaElementSkeleton implements CanvaElementSkeletonType {
    @Prop({ required: true }) fill: string;

    @Prop({ required: true }) x: number;

    @Prop({ required: true }) y: number;

    @Prop({ required: true }) width: number;

    @Prop({ required: true }) height: number;

    @Prop({ required: true }) id: string;

    @Prop({ type: [String], required: true }) outgoingArrowIds: string[];

    @Prop({ type: [String], required: true }) incomingArrowIds: string[];

    @Prop({ type: [HighlightPointsSchema], required: true })
    points: HighlightPointsType[];

    @Prop({ required: true }) strokeColor: string;

    @Prop({ required: true }) strokeWidth: number;

    @Prop({ required: true }) opacity: number;

    @Prop({ required: true }) rotation: number;
}

export type CanvaElementSkeletonDocument = CanvaElementSkeleton & Document;
export const CanvaElementSkeletonSchema =
    SchemaFactory.createForClass(CanvaElementSkeleton);
// Access the schema of the array items
