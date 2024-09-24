// rect-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CanvaElementSkeleton, CanvaElementSkeletonType } from "../canvaElementSkeleton";

export interface RectElementType extends CanvaElementSkeletonType {
    type: "rect";
}

@Schema({ discriminatorKey: "type", _id: false })
export class RectElement extends CanvaElementSkeleton {
    @Prop({ required: true, enum: ["rect"] }) type: "rect";
}

export type RectElementDocument = RectElement & Document;
export const RectElementSchema = SchemaFactory.createForClass(RectElement);
