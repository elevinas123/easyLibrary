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
    _id!: Types.ObjectId;

    @Prop({ required: true }) name!: string;

    @Prop({ required: true, default: Date.now }) createdAt!: Date;

    // Reference to Book collection
    @Prop({
        require: true,
        type: [{ type: Types.ObjectId, ref: "Book" }],
        default: [],
    })
    books!: Types.ObjectId[];
}

export const BookshelveSchema = SchemaFactory.createForClass(Bookshelve);
