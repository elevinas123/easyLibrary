// rect-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
    CanvaElementSkeletonSchema,
    CanvaElementSkeletonType,
} from "./canvaElementSkeleton.schema";

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
    @Prop({ required: true }) fillStyle!: string;

    @Prop({ required: true }) roughness!: number;

    @Prop({ required: true }) seed!: number;

    @Prop({ required: true }) hachureGap!: number;

    @Prop({ required: true }) hachureAngle!: number;

    get type(): "rect" {
        return "rect";
    }
}

export type RectElementDocument = RectElement & Document;
export const RectElementSchema = SchemaFactory.createForClass(RectElement);
CanvaElementSkeletonSchema.discriminator("rect", RectElementSchema);
