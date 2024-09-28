// text-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
} from "../canvaElementSkeleton";


@Schema({ _id: false })
export class TextElement extends CanvaElementSkeleton {
    @Prop({ required: true }) text: string;

    @Prop({ required: true }) fontFamily: string;

    @Prop({ required: true }) fontSize: number;
}

export type TextElementDocument = TextElement & Document;
export const TextElementSchema = SchemaFactory.createForClass(TextElement);
