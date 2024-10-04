<<<<<<< HEAD
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { CurveElementSkeleton } from "../curveElementSkeleton";

export type StartType = string | null|  undefined;
@modelOptions({ schemaOptions: { _id: false } })
// No separate _id for sub-documents
export class ArrowElement extends CurveElementSkeleton {
    @prop({ default: null }) startId!: string | null;

    @prop({ default: null }) endId!: string | null;
=======
// arrow-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CurveElementSkeleton,
    CurveElementSkeletonSchema,
    CurveElementSkeletonType,
} from "../curveElementSkeleton";

export interface ArrowElementType extends CurveElementSkeletonType {
    type: "arrow";
    startId: string | null;
    endId: string | null;
    startType: StartType;
    endType: StartType;
}
export type StartType = "bookText" | "text" | null;

@Schema({ _id: false })
export class ArrowElement
    extends CurveElementSkeleton
    implements ArrowElementType
{
    @Prop({ type: String, default: null }) startId: string | null;
>>>>>>> MongooseBackend

    @prop({ enum: ["bookText", "text", null], default: null })
    startType!: StartType;

    @prop({ enum: ["bookText", "text", null], default: null })
    endType!: StartType;

<<<<<<< HEAD
    @prop({ required: true, default: "arrow" })
    // Enforce 'type' field explicitly
    readonly type!: "arrow"; // TypeScript now recognizes the type as 'text'
}

// Create the model for ArrowElement
export const ArrowElementModel = getModelForClass(ArrowElement);
=======
    @Prop({ type: String, enum: ["bookText", "text", null], default: null })
    endType: StartType;

    get type(): "arrow" {
        return "arrow";
    }
}

export type ArrowElementDocument = ArrowElement & Document;
export const ArrowElementSchema = SchemaFactory.createForClass(ArrowElement);
CurveElementSkeletonSchema.discriminator("arrow", ArrowElementSchema);
>>>>>>> MongooseBackend
