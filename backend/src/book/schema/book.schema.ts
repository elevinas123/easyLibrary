// book.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

import { ProcessedElementSchema } from "./bookElements/processedElement.schema";
import { CanvaElementSkeletonSchema } from "./canvaElements/canvaElementSkeleton";
import {
    RectElement,
    RectElementSchema,
} from "./canvaElements/elements/rectElement.schema";
import {
    TextElement,
    TextElementSchema,
} from "./canvaElements/elements/textElement.schema";
import { CurveElementSkeletonSchema } from "./curveElements/curveElementSkeleton";
import {
    ArrowElement,
    ArrowElementSchema,
} from "./curveElements/elements/arrowElement.schema";

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({ type: String, required: true }) title: string;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true }) description: string;

    @Prop({ type: String, required: true }) author: string;

    @Prop({ type: [String], required: true }) genre: string[];

    @Prop({ type: String, required: true }) imageUrl: string;

    @Prop({ type: Boolean, required: true }) liked: boolean;

    @Prop({ type: Date, required: true }) dateAdded: Date;

    @Prop({
        type: [ProcessedElementSchema],
        required: true,
    })
    bookElements: any[]; // Replace 'any' with your specific type if needed

    @Prop({ type: [CanvaElementSkeletonSchema], required: true })
    canvaElements: (RectElement | TextElement)[];

    @Prop({
        type: [CurveElementSkeletonSchema], // Use the base schema
        required: true,
    })
    curveElements: ArrowElement[]; // Initially only ArrowElement; extend when
    // adding LineElement
}

export const BookSchema = SchemaFactory.createForClass(Book);
