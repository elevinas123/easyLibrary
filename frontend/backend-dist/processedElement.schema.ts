import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProcessedElementType = {
    text: string;
    lineX: number;
    lineWidth: number;
    lineY: number;
};

@Schema({_id: false})  // Prevents creation of a separate _id for subDocuments
export class ProcessedElement implements ProcessedElementType {
  @Prop({required: true}) text!: string;

  @Prop({required: true}) lineX!: number;

  @Prop({required: true}) lineWidth!: number;

  @Prop({required: true}) lineY!: number;
}

export type ProcessedElementDocument = ProcessedElement & Document;
export const ProcessedElementSchema =
    SchemaFactory.createForClass(ProcessedElement);
