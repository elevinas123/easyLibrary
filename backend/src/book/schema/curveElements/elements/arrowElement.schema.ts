import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { CurveElementSkeleton } from "../curveElementSkeleton";

export type StartType = string | null|  undefined;
@modelOptions({ schemaOptions: { _id: false } })
// No separate _id for sub-documents
export class ArrowElement extends CurveElementSkeleton {
    @prop({ default: null }) startId!: string | null;

    @prop({ default: null }) endId!: string | null;

    @prop({ enum: ["bookText", "text", null], default: null })
    startType!: StartType;

    @prop({ enum: ["bookText", "text", null], default: null })
    endType!: StartType;

    @prop({ required: true, default: "arrow" })
    // Enforce 'type' field explicitly
    readonly type!: "arrow"; // TypeScript now recognizes the type as 'text'
}

// Create the model for ArrowElement
export const ArrowElementModel = getModelForClass(ArrowElement);
