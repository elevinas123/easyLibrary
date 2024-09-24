// arrow-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CurveElementSkeleton, CurveElementSkeletonType } from "../curveElementSkeleton";

export type StartType = "bookText" | "text" | null;

export interface ArrowElementType extends CurveElementSkeletonType {
  type: 'arrow';
  startId: string|null;
  endId: string|null;
  startType: StartType;
  endType: StartType;
}


@Schema({ discriminatorKey: "type", _id: false })
export class ArrowElement extends CurveElementSkeleton {
    @Prop({ type: String, enum: ["arrow"], required: true }) type: "arrow";

    @Prop({ type: String, default: null }) startId: string | null;

    @Prop({ type: String, default: null }) endId: string | null;

    @Prop({ type: String, enum: ["bookText", "text"], required: true })
    startType: StartType;

    @Prop({ type: String, enum: ["bookText", "text"], required: true })
    endType: StartType;
}

export type ArrowElementDocument = ArrowElement & Document;
export const ArrowElementSchema = SchemaFactory.createForClass(ArrowElement);
