// text-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
    CanvaElementSkeletonType,
} from "../canvaElementSkeleton";

export interface TextElementType extends CanvaElementSkeletonType {
    text: string;
    fontFamily: string;
    fontSize: number;
}
@Schema({ _id: false })
export class TextElement {
    @Prop({ required: true }) text: string;

    @Prop({ required: true }) fontFamily: string;

    @Prop({ required: true }) fontSize: number;
}

export type TextElementDocument = TextElement & Document;
export const TextElementSchema = SchemaFactory.createForClass(TextElement);
