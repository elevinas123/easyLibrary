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
    _id!: Types.ObjectId;

    @Prop({ type: String, required: true }) title!: string;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId!: Types.ObjectId;

    @Prop({ type: String, required: true }) description!: string;

    @Prop({ type: String, required: true }) author!: string;

    @Prop({ type: [String], required: true }) genre!: string[];

    @Prop({ type: String, required: true }) imageUrl!: string;

    @Prop({ type: Boolean, required: true }) liked!: boolean;

    @Prop({ type: String, required: true }) dateAdded!: string;

    @Prop({
        type: [ProcessedElementSchema],
        required: true,
    })
    bookElements!: ProcessedElementType[];

    @Prop({ type: [HighlightSchema], required: true })
    highlights!: HighlightType[];

    @Prop({ type: [CanvaElementSkeletonSchema], required: true })
    canvaElements!: CanvaElementType[];

    @Prop({
        type: [CurveElementSkeletonSchema],
        required: true,
    })
    curveElements!: ArrowElementType[];

    @Prop({ type: Number, required: true }) scale!: number;

    @Prop({
        type: { offsetPosition: OffsetPositionSchema },
    })
    offsetPosition!: OffsetPositionType;
}

export const BookSchema = SchemaFactory.createForClass(Book);
