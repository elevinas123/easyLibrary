// text-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
    CanvaElementSkeletonType,
} from "../canvaElementSkeleton";

export interface TextElementType extends CanvaElementSkeletonType {
    type: "text";
    text: string;
    fontFamily: string;
    fontSize: number;
}

@Schema({ discriminatorKey: "type", _id: false })
export class TextElement extends CanvaElementSkeleton {
    @Prop({ required: true, enum: ["text"] }) type: "text";

    @Prop({ required: true }) text: string;

    @Prop({ required: true }) fontFamily: string;

    @Prop({ required: true }) fontSize: number;
}

export type TextElementDocument = TextElement & Document;
export const TextElementSchema = SchemaFactory.createForClass(TextElement);
