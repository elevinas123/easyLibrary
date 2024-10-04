<<<<<<< HEAD:backend/src/book/schema/canvaElements/canvaElementSkeleton.ts
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { HighlightPoints } from "./highlightPoints.schema";

@modelOptions({ schemaOptions: { discriminatorKey: "type", _id: false } })
export class CanvaElementSkeleton {
    @prop({ required: true }) fill!: string;
=======
// canva-element-skeleton.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    HighlightPointsSchema,
    HighlightPointsType,
} from "./highlights/highlightPoints.schema";
import { RectElementType } from "./elements/rectElement.schema";
import { TextElementType } from "./elements/textElement.schema";
import { BookTextElementType } from "./elements/bookTextElement.schema";

export type CanvaElementSkeletonType = {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
    outgoingArrowIds: string[];
    incomingArrowIds: string[];
    points: HighlightPointsType[];
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
};
export type CanvaElementType =
    | RectElementType
    | TextElementType
    | BookTextElementType;
@Schema({ discriminatorKey: "type", _id: false })
export class CanvaElementSkeleton implements CanvaElementSkeletonType {
    @Prop({ required: true }) fill: string;
>>>>>>> MongooseBackend:backend/src/book/schema/canvaElements/canvaElementSkeleton.schema.ts

    @prop({ required: true }) x!: number;

    @prop({ required: true }) y!: number;

    @prop({ required: true }) width!: number;

    @prop({ required: true }) height!: number;

    @prop({ required: true }) id!: string;

    @prop({ type: () => [String], required: true }) outgoingArrowIds!: string[];

    @prop({ type: () => [String], required: true }) incomingArrowIds!: string[];

    @prop({ type: () => [HighlightPoints], required: true })
    points!: HighlightPoints[];

    @prop({ required: true }) strokeColor!: string;

    @prop({ required: true }) strokeWidth!: number;

    @prop({ required: true }) opacity!: number;

    @prop({ required: true }) rotation!: number;

    // `type` will be set by the discriminator, not directly in the base class
}

<<<<<<< HEAD:backend/src/book/schema/canvaElements/canvaElementSkeleton.ts
export const CanvaElementModel = getModelForClass(CanvaElementSkeleton);
=======
export type CanvaElementSkeletonDocument = CanvaElementSkeleton & Document;
export const CanvaElementSkeletonSchema =
    SchemaFactory.createForClass(CanvaElementSkeleton);
// Access the schema of the array items
>>>>>>> MongooseBackend:backend/src/book/schema/canvaElements/canvaElementSkeleton.schema.ts
