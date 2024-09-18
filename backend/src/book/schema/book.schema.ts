import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookDocument = Book & Document;

export type ProcessedElement = {
    text: string;
    lineX: number;
    lineWidth: number;
    lineY: number;
};

@Schema()
export class Book {
    @Prop({ required: true }) title: string;

    @Prop({ required: true }) description: string;

    @Prop({ required: true }) author: string;

    @Prop({ required: true }) genre: string[];

    @Prop({ required: true }) imageUrl: string;

    @Prop({ required: true }) liked: boolean;

    @Prop({ required: true }) dateAdded: Date;

    @Prop({
        type: [
            {
                text: String,
                lineX: Number,
                lineWidth: Number,
                lineY: Number,
            },
        ],
        required: true,
    })
    bookElements: ProcessedElement[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
