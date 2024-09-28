import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { CanvaElementSkeleton } from "../canvaElementSkeleton";
@modelOptions({ schemaOptions: { _id: false } })
export class TextElement extends CanvaElementSkeleton {
    @prop({ required: true }) text!: string;

    @prop({ required: true }) fontFamily!: string;

    @prop({ required: true }) fontSize!: number;

    @prop({ required: true }) sd!: number;

    // The 'type' getter will return the discriminator value ('text')
    @prop({ required: true, default: "text" }) // Enforce 'type' field explicitly
    readonly type!: "text"; // TypeScript now recognizes the type as 'text'
}
export const TextElementModel = getModelForClass(TextElement);
