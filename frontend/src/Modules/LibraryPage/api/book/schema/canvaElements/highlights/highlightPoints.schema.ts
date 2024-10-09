// canva-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type HighlightPointsType = {
    x: number;
    y: number;
}; // Example structure for HighlightPoints

@Schema({ _id: false })
export class HighlightPoints implements HighlightPointsType {
    @Prop({ required: true }) x!: number;

    @Prop({ required: true }) y!: number;
}

export type HighlightPointsDocument = HighlightPoints & Document;
export const HighlightPointsSchema =
    SchemaFactory.createForClass(HighlightPoints);
