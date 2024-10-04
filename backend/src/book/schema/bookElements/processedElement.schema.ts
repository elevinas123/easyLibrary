<<<<<<< HEAD
import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose';

@modelOptions({schemaOptions: {_id: false}})
// Prevents creation of a separate _id for subDocuments
export class ProcessedElement {
  @prop({required: true}) text!: string;

  @prop({required: true}) lineX!: number;

  @prop({required: true}) lineWidth!: number;

  @prop({required: true}) lineY!: number;
=======
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
>>>>>>> MongooseBackend
}

// Create the Typegoose model
export const ProcessedElementModel = getModelForClass(ProcessedElement);
