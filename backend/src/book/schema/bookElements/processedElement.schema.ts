import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose';

@modelOptions({schemaOptions: {_id: false}})
// Prevents creation of a separate _id for subDocuments
export class ProcessedElement {
  @prop({required: true}) text!: string;

  @prop({required: true}) lineX!: number;

  @prop({required: true}) lineWidth!: number;

  @prop({required: true}) lineY!: number;
}

// Create the Typegoose model
export const ProcessedElementModel = getModelForClass(ProcessedElement);
