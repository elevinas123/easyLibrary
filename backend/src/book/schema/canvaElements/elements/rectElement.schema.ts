// rect-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
    CanvaElementSkeletonType,
} from "../canvaElementSkeleton";

export interface RectElementType extends CanvaElementSkeletonType {}
@Schema({_id: false})
export class RectElement {}

export type RectElementDocument = RectElement & Document;
export const RectElementSchema = SchemaFactory.createForClass(RectElement);
