import {getModelForClass, modelOptions, prop} from '@typegoose/typegoose';

// Define the TypeScript type for Highlight
export type HighlightType = {
  id: string; startingX: number; startingY: number; endX: number; endY: number;
};

<<<<<<< HEAD
@modelOptions({schemaOptions: {_id: false}})  // Disable _id for subdocuments
export class Highlight {
  @prop({required: true}) id!: string;
=======
@Schema({ _id: false })
export class Highlight implements HighlightType {
    @Prop({ required: true }) id: string;
>>>>>>> MongooseBackend

  @prop({required: true}) startingX!: number;

  @prop({required: true}) startingY!: number;

  @prop({required: true}) endX!: number;

  @prop({required: true}) endY!: number;
}

// Create the Highlight model using Typegoose
export const HighlightModel = getModelForClass(Highlight);
