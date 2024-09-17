// src/cats/schemas/cat.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({ required: true }) userId: string;

    @Prop({ require: true }) title: number;

    @Prop({ required: true }) description: string;

    @Prop({required: true}) author: string;

    @Prop({required: true}) genre: string[];

    @Prop({ required: true }) imageUrl: string;
    
    @Prop({ required: true }) liked: boolean;
    
    @Prop({ required: true }) dateAdded: Date;

}

export const BookSchema = SchemaFactory.createForClass(Book);
