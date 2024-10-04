// curve-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ArrowElementSchema } from "./elements/arrowElement.schema";

export interface CurveElementSkeletonType {
    points: number[];
    id: string;
    fill: string;
    text: null | string;
    roughness: number;
    bowing: number;
    seed: number;
    strokeWidth: number;
    strokeStyle: "solid" | "dashed" | "dotted";
    stroke: string;
    fillStyle:
        | "solid"
        | "hachure"
        | "cross-hatch"
        | "zigzag"
        | "dots"
        | "dashed"
        | "zigzag-line";
    fillWeight: number;
    hachureAngle: number;
    hachureGap: number;
}

@Schema({ discriminatorKey: "type", _id: false })
// No separate _id for subDocuments
export class CurveElementSkeleton implements CurveElementSkeletonType {
    @Prop({ type: String, required: true }) id: string;

    @Prop({ type: String, required: true }) fill: string;

    @Prop({ type: [Number], required: true }) points: number[];

    @Prop({ type: String, default: null }) text: string | null;

    @Prop({ type: Number, required: true }) roughness: number;

    @Prop({ type: Number, required: true }) bowing: number;

    @Prop({ type: Number, required: true }) seed: number;

    @Prop({ type: Number, required: true }) strokeWidth: number;

    @Prop({ type: String, enum: ["solid", "dashed", "dotted"], required: true })
    strokeStyle: "solid" | "dashed" | "dotted";

    @Prop({ type: String, required: true }) stroke: string;

    @Prop({
        type: String,
        enum: [
            "solid",
            "hachure",
            "cross-hatch",
            "zigzag",
            "dots",
            "dashed",
            "zigzag-line",
        ],
        required: true,
    })
    fillStyle:
        | "solid"
        | "hachure"
        | "cross-hatch"
        | "zigzag"
        | "dots"
        | "dashed"
        | "zigzag-line";

    @Prop({ type: Number, required: true }) fillWeight: number;

    @Prop({ type: Number, required: true }) hachureAngle: number;

    @Prop({ type: Number, required: true }) hachureGap: number;
}

export type CurveElementSkeletonDocument = CurveElementSkeleton & Document;
export const CurveElementSkeletonSchema =
    SchemaFactory.createForClass(CurveElementSkeleton);
