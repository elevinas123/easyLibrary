// curve-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ArrowElementSchema } from "./elements/arrowElement.schema";

export interface CurveElementSkeletonType {
    points: number[];
    id: string;
    fill: string;
    text: null | string;
}

@Schema({ discriminatorKey: "type", _id: false })
// No separate _id for subDocuments
export class CurveElementSkeleton {
    @Prop({ type: String, required: true }) id: string;

    @Prop({ type: String, required: true }) fill: string;

    @Prop({ type: [Number], required: true }) points: number[];

    @Prop({ type: String, default: null }) text: string | null;
}

export type CurveElementSkeletonDocument = CurveElementSkeleton & Document;
export const CurveElementSkeletonSchema =
    SchemaFactory.createForClass(CurveElementSkeleton);
CurveElementSkeletonSchema.discriminator('arrow', ArrowElementSchema);
