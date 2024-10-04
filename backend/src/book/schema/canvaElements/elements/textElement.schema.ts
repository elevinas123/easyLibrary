<<<<<<< HEAD
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { CanvaElementSkeleton } from "../canvaElementSkeleton";
@modelOptions({ schemaOptions: { _id: false } })
export class TextElement extends CanvaElementSkeleton {
    @prop({ required: true }) text!: string;
=======
// text-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import {
    CanvaElementSkeleton,
    CanvaElementSkeletonSchema,
    CanvaElementSkeletonType,
} from "../canvaElementSkeleton.schema";

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
    @Prop({ required: true }) text: string;
>>>>>>> MongooseBackend

    @prop({ required: true }) fontFamily!: string;

<<<<<<< HEAD
    @prop({ required: true }) fontSize!: number;

    @prop({ required: true, default: "text" })
    readonly type!: "text";
}
export const TextElementModel = getModelForClass(TextElement);
=======
    @Prop({ required: true }) fontSize: number;
    get type(): "text" {
        return "text";
    }
}

export type TextElementDocument = TextElement & Document;
export const TextElementSchema = SchemaFactory.createForClass(TextElement);
CanvaElementSkeletonSchema.discriminator("text", TextElementSchema);
>>>>>>> MongooseBackend
