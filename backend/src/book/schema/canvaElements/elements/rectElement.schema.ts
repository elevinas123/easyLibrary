import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { CanvaElementSkeleton } from "../canvaElementSkeleton";

// Extend the base class CanvaElementSkeleton
@modelOptions({ schemaOptions: { _id: false } })
export class RectElement extends CanvaElementSkeleton {
    @prop({ required: true }) fillStyle!: string;

    @prop({ required: true }) roughness!: number;

    @prop({ required: true }) seed!: number;

    @prop({ required: true }) hachureGap!: number;

    @prop({ required: true }) hachureAngle!: number;

    // The 'type' getter will return the discriminator value ('text')
    @prop({required: true, default: 'rect'})  // Enforce 'type' field explicitly
    readonly type!: 'rect';  // TypeScript now recognizes the type as 'text
}

// You don't need `SchemaFactory` or `@Schema` decorators, as Typegoose handles
// this Define the model using Typegoose
export const RectElementModel = getModelForClass(RectElement);
