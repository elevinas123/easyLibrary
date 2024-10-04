// rect-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CanvaElementSkeleton } from "../canvaElementSkeleton";

@Schema({ _id: false })
export class RectElement {
    @Prop({ required: true }) fillStyle: string;

    @Prop({ required: true }) roughness: number;

    @Prop({ required: true }) seed: number;

    @Prop({ required: true }) hachureGap: number;

    @Prop({ required: true }) hachureAngle: number;
}

export type RectElementDocument = RectElement & Document;
export const RectElementSchema = SchemaFactory.createForClass(RectElement);
