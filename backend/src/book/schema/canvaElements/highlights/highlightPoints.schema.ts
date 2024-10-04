import { getModelForClass, prop } from "@typegoose/typegoose";

<<<<<<< HEAD:backend/src/book/schema/canvaElements/highlightPoints.schema.ts
// Use Typegoose for the HighlightPoints class
export class HighlightPoints {
    @prop({ required: true }) x!: number;
=======
export type HighlightPointsType = {
    x: number;
    y: number;
}; // Example structure for HighlightPoints

@Schema({ _id: false })
export class HighlightPoints implements HighlightPointsType {
    @Prop({ required: true }) x: number;
>>>>>>> MongooseBackend:backend/src/book/schema/canvaElements/highlights/highlightPoints.schema.ts

    @prop({ required: true }) y!: number;
}

// Create the model for HighlightPoints
export const HighlightPointsModel = getModelForClass(HighlightPoints);
