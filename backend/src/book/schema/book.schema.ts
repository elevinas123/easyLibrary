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

@modelOptions({ schemaOptions: { _id: true } })
export class Book {
    @prop({ type: () => Types.ObjectId, required: true, auto: true })
    _id!: Types.ObjectId;

    @prop({ required: true }) title!: string;

    @prop({ ref: "User", required: true }) userId!: Types.ObjectId;

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
        type: () => ({
            x: Number,
            y: Number,
        }),
        required: true,
    })
    offsetPosition!: { x: number; y: number };
}

// Create the model for Book
export const BookModel = getModelForClass(Book);
