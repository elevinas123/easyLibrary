// src/bookshelve/schema/bookshelve.schema.ts

import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Book } from "src/book/schema/book.schema";

export class Bookshelve {
    @prop({ type: () => Types.ObjectId, required: true, auto: true })
    _id!: Types.ObjectId;

    @prop({ required: true }) public name!: string;

    @prop({ required: true, default: () => new Date() })
    public createdAt!: Date;

    // Reference to Book collection
    @prop({
        required: true,
        ref: () => Book, // Typegoose uses a function to reference other classes
        default: () => [],
    })
    public books!: Ref<Book>[];
}

export const BookshelveModel = getModelForClass(Bookshelve);
