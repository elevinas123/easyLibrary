import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Book } from "src/book/schema/book.schema";

export type BookshelveDocument = Bookshelve & Document;

@Schema()
export class Bookshelve {
    @Prop({ required: true }) name: string;

    @Prop({ required: true, default: Date.now }) createdAt: Date;

    // Reference to Book collection
    @Prop({
        require: true,
        type: [{ type: Types.ObjectId, ref: "Book" }],
        default: [],
    })
    books: Types.ObjectId[];
}

export const BookshelveSchema = SchemaFactory.createForClass(Bookshelve);
