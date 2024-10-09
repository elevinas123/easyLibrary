// arrow-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CurveElementSkeleton,
    CurveElementSkeletonSchema,
    CurveElementSkeletonType,
} from "./curveElementSkeleton";

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
    @Prop({ type: String, default: null }) startId!: string | null;

    @Prop({ type: String, default: null }) endId!: string | null;

    @Prop({ type: String, enum: ["bookText", "text", null], default: null })
    startType!: StartType;

    @Prop({ type: String, enum: ["bookText", "text", null], default: null })
    endType!: StartType;

    get type(): "arrow" {
        return "arrow";
    }
}

export type ArrowElementDocument = ArrowElement & Document;
export const ArrowElementSchema = SchemaFactory.createForClass(ArrowElement);
CurveElementSkeletonSchema.discriminator("arrow", ArrowElementSchema);
