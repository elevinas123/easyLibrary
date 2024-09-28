import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

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

// Create the model for CurveElementSkeleton
export const CurveElementSkeletonModel = getModelForClass(CurveElementSkeleton);
