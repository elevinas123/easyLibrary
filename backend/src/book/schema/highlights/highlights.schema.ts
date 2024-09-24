import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type HighlightType = {
    id: string;
    startingX: number;
    startingY: number;
    endX: number;
    endY: number;
};
export type HighlightDocument = Highlight & Document;

@Schema({ _id: false })
export class Highlight {
    @Prop({ required: true }) id: string;

    @Prop({ required: true }) startingX: number;

    @Prop({ required: true }) startingY: number;

    @Prop({ required: true }) endX: number;

    @Prop({ required: true }) endY: number;
}

export const HighlightSchema = SchemaFactory.createForClass(Highlight);
