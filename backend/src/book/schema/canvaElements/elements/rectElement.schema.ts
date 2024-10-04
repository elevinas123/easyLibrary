<<<<<<< HEAD
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { CanvaElementSkeleton } from "../canvaElementSkeleton";

// Extend the base class CanvaElementSkeleton
@modelOptions({ schemaOptions: { _id: false } })
export class RectElement extends CanvaElementSkeleton {
    @prop({ required: true }) fillStyle!: string;
=======
// rect-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
    CanvaElementSkeletonSchema,
    CanvaElementSkeletonType,
} from "../canvaElementSkeleton.schema";

export interface RectElementType extends CanvaElementSkeletonType {
    type: "rect";
    fillStyle: string;
    roughness: number;
    seed: number;
    hachureGap: number;
    hachureAngle: number;
}

@Schema({ _id: false })
export class RectElement
    extends CanvaElementSkeleton
    implements RectElementType
{
    @Prop({ required: true }) fillStyle: string;
>>>>>>> MongooseBackend

    @prop({ required: true }) roughness!: number;

    @prop({ required: true }) seed!: number;

    @prop({ required: true }) hachureGap!: number;

<<<<<<< HEAD
    @prop({ required: true }) hachureAngle!: number;

    // The 'type' getter will return the discriminator value ('text')
    @prop({required: true, default: 'rect'})  // Enforce 'type' field explicitly
    readonly type!: 'rect';  // TypeScript now recognizes the type as 'text
}

// You don't need `SchemaFactory` or `@Schema` decorators, as Typegoose handles
// this Define the model using Typegoose
export const RectElementModel = getModelForClass(RectElement);
=======
    @Prop({ required: true }) hachureAngle: number;

    get type(): "rect" {
        return "rect";
    }
}

export type RectElementDocument = RectElement & Document;
export const RectElementSchema = SchemaFactory.createForClass(RectElement);
CanvaElementSkeletonSchema.discriminator("rect", RectElementSchema);
>>>>>>> MongooseBackend
