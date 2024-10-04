<<<<<<< HEAD
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
=======
// curve-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
>>>>>>> MongooseBackend

// Define the base class with Typegoose
@modelOptions({
    schemaOptions: {
        discriminatorKey: "type", // Define the discriminator key for sub-documents
        _id: false, // No separate _id for sub-documents
    },
})
export class CurveElementSkeleton {
    @prop({ required: true }) id!: string;

    @prop({ required: true }) fill!: string;

    @prop({ type: () => [Number], required: true }) points!: number[];

    @prop({ type: String, default: null }) text?: string | null;

    @prop({ required: true }) roughness!: number;

    @prop({ required: true }) bowing!: number;

    @prop({ required: true }) seed!: number;

    @prop({ required: true }) strokeWidth!: number;

    @prop({ enum: ["solid", "dashed", "dotted"], required: true })
    strokeStyle!: "solid" | "dashed" | "dotted";

    @prop({ required: true }) stroke!: string;

    @prop({
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
    fillStyle!:
        | "solid"
        | "hachure"
        | "cross-hatch"
        | "zigzag"
        | "dots"
        | "dashed"
        | "zigzag-line";

    @prop({ required: true }) fillWeight!: number;

    @prop({ required: true }) hachureAngle!: number;

    @prop({ required: true }) hachureGap!: number;
}

<<<<<<< HEAD
// Create the model for CurveElementSkeleton
export const CurveElementSkeletonModel = getModelForClass(CurveElementSkeleton);
=======
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
>>>>>>> MongooseBackend
