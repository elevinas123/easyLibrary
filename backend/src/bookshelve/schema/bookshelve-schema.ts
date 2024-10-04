<<<<<<< HEAD
// src/bookshelve/schema/bookshelve.schema.ts

import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Book } from "src/book/schema/book.schema";

export class Bookshelve {
    @prop({ type: () => Types.ObjectId, required: true, auto: true })
    _id!: Types.ObjectId;
=======
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookshelveDocument = Bookshelve & Document;

export type BookshelveType = {
    _id: Types.ObjectId;
    name: string;
    createdAt: Date;
    books: Types.ObjectId[];
};
@Schema()
export class Bookshelve implements BookshelveType {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true }) name: string;
>>>>>>> MongooseBackend

    @prop({ required: true }) public name!: string;

    @prop({ required: true, default: () => new Date() })
    public createdAt!: Date;

    // Reference to Book collection
    @prop({
        required: true,
        ref: () => Book, // Typegoose uses a function to reference other classes
        default: () => [],
    })
    public books!: Types.ObjectId[];
}

export const BookshelveModel = getModelForClass(Bookshelve);
