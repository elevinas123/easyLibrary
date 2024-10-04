<<<<<<< HEAD
import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

import { ProcessedElement } from "./bookElements/processedElement.schema";
import { CanvaElementSkeleton } from "./canvaElements/canvaElementSkeleton";
import { RectElement } from "./canvaElements/elements/rectElement.schema";
import { TextElement } from "./canvaElements/elements/textElement.schema";
import { CurveElementSkeleton } from "./curveElements/curveElementSkeleton";
import { ArrowElement } from "./curveElements/elements/arrowElement.schema";
import { Highlight } from "./highlights/highlights.schema";
import { User } from "src/user/schemas/user.schema";
import { OffsetPosition } from "./offsetPosition.schema";

@modelOptions({ schemaOptions: { _id: true } })
export class Book {
=======
// book.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import {
    ProcessedElementSchema,
    ProcessedElementType,
} from "./bookElements/processedElement.schema";
import {
    CanvaElementSkeletonSchema,
    CanvaElementType,
} from "./canvaElements/canvaElementSkeleton.schema";
import { CurveElementSkeletonSchema } from "./curveElements/curveElementSkeleton";
import { ArrowElementType } from "./curveElements/elements/arrowElement.schema";
import { HighlightSchema, HighlightType } from "./highlights/highlights.schema";
import {
    OffsetPositionSchema,
    OffsetPositionType,
} from "./offsetPosition/offsetPosition.schema";

export type BookDocument = Book & Document;

export type BookType = {
    _id: Types.ObjectId;
    title: string;
    userId: Types.ObjectId;
    description: string;
    author: string;
    genre: string[];
    imageUrl: string;
    liked: boolean;
    dateAdded: string;
    bookElements: ProcessedElementType[];
    highlights: HighlightType[];
    canvaElements: CanvaElementType[];
    curveElements: ArrowElementType[];
    scale: number;
    offsetPosition: OffsetPositionType;
};
@Schema()
export class Book implements BookType {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;
>>>>>>> MongooseBackend

    @prop({ required: true }) title!: string;

    @prop({ required: true }) description!: string;

    @prop({ required: true }) author!: string;

    @prop({ type: () => [String], required: true }) genre!: string[];

    @prop({ required: true }) imageUrl!: string;

    @prop({ required: true }) liked!: boolean;

    @prop({ required: true }) dateAdded!: string;

    @prop({ type: () => [ProcessedElement], required: true })
    bookElements!: ProcessedElement[];

    @prop({ type: () => [Highlight], required: true }) highlights!: Highlight[];

    @prop({ type: () => [CanvaElementSkeleton], required: true })
    canvaElements!: (RectElement | TextElement)[];

    @prop({ type: () => [CurveElementSkeleton], required: true })
    curveElements!: ArrowElement[];

    @prop({ required: true }) scale!: number;

    @prop({
        type: () => OffsetPosition,
        required: true,
    })
<<<<<<< HEAD
    offsetPosition!: OffsetPosition;
=======
    bookElements: ProcessedElementType[];

    @Prop({ type: [HighlightSchema], required: true })
    highlights: HighlightType[];

    @Prop({ type: [CanvaElementSkeletonSchema], required: true })
    canvaElements: CanvaElementType[];

    @Prop({
        type: [CurveElementSkeletonSchema],
        required: true,
    })
    curveElements: ArrowElementType[];

    @Prop({ type: Number, required: true }) scale: number;

    @Prop({
        type: { offsetPosition: OffsetPositionSchema },
    })
    offsetPosition: OffsetPositionType;
>>>>>>> MongooseBackend
}

// Create the model for Book
export const BookModel = getModelForClass(Book);
