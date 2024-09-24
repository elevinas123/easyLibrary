// canva-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { HighlightPointsSchema, HighlightPointsType } from "./highlightPoints.schema";



export type CanvaElementSkeletonType = {
  fill: string; x: number; y: number; width: number; height: number; id: string;
  outgoingArrowIds: string[];
  incomingArrowIds: string[];
  points: HighlightPointsType[];
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
};

@Schema({ _id: false }) // Prevents creation of a separate _id for subDocuments
export class CanvaElementSkeleton {
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
}

export type CanvaElementSkeletonDocument = CanvaElementSkeleton & Document;
export const CanvaElementSkeletonSchema =
    SchemaFactory.createForClass(CanvaElementSkeleton);
