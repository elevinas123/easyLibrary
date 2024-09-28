import { getModelForClass, prop } from "@typegoose/typegoose";

// Use Typegoose for the HighlightPoints class
export class HighlightPoints {
    @prop({ required: true }) x!: number;

    @prop({ required: true }) y!: number;
}

// Create the model for HighlightPoints
export const HighlightPointsModel = getModelForClass(HighlightPoints);
