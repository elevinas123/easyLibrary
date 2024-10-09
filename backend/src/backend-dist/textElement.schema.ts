// text-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import {
    CanvaElementSkeleton,
    CanvaElementSkeletonSchema,
    CanvaElementSkeletonType,
} from "./canvaElementSkeleton.schema";

export interface TextElementType extends CanvaElementSkeletonType {
    type: "text";
    text: string;
    fontFamily: string;
    fontSize: number;
}
@Schema({ _id: false })
export class TextElement
    extends CanvaElementSkeleton
    implements TextElementType
{
    @Prop({ required: true }) text!: string;

    @Prop({ required: true }) fontFamily!: string;

    @Prop({ required: true }) fontSize!: number;
    get type(): "text" {
        return "text";
    }
}

export type TextElementDocument = TextElement & Document;
export const TextElementSchema = SchemaFactory.createForClass(TextElement);
CanvaElementSkeletonSchema.discriminator("text", TextElementSchema);
