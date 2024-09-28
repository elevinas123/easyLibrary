import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { CurveElementSkeleton } from "../curveElementSkeleton";

export type StartType = "bookText" | "text" | null;

@modelOptions({ schemaOptions: { _id: false } })
// No separate _id for sub-documents
export class ArrowElement extends CurveElementSkeleton {
    @prop({ default: null }) startId!: string | null;

    @prop({ default: null }) endId!: string | null;

    @prop({ enum: ["bookText", "text", null], default: null })
    startType!: StartType;

    @prop({ enum: ["bookText", "text", null], default: null })
    endType!: StartType;

    get type(): "rect" {
        return "rect";
    }
}

// Create the model for ArrowElement
export const ArrowElementModel = getModelForClass(ArrowElement);
