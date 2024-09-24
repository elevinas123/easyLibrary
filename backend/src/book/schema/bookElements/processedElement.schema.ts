// processed-element.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ _id: false }) // Prevents creation of a separate _id for subDocuments
export class ProcessedElement {
    @Prop({ required: true }) text: string;

    @Prop({ required: true }) lineX: number;

    @Prop({ required: true }) lineWidth: number;

    @Prop({ required: true }) lineY: number;
}

export type ProcessedElementDocument = ProcessedElement & Document;
export const ProcessedElementSchema =
    SchemaFactory.createForClass(ProcessedElement);
