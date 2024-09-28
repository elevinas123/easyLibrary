import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { CanvaElementSkeleton } from "../canvaElementSkeleton";
@modelOptions({ schemaOptions: { _id: false } })
export class TextElement extends CanvaElementSkeleton {
    @prop({ required: true }) text!: string;

    @prop({ required: true }) fontFamily!: string;

    @prop({ required: true }) fontSize!: number;

    @prop({ required: true, default: "text" })
    readonly type!: "text";
}
export const TextElementModel = getModelForClass(TextElement);
