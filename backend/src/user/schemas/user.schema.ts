// src/cats/schemas/cat.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Bookshelve } from "src/bookshelve/schema/bookshelve-schema";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;
    
    @Prop({ required: true }) username: string;

    @Prop({ require: true }) age: number;

    @Prop({ required: true }) password: string;

    @Prop() comment: string;

    @Prop({
        required: true,
        type: [{ type: Types.ObjectId, ref: "Book" }],
        default: [],
    })
    books: Types.ObjectId[];

    // Reference to Bookshelve collection
    @Prop({
        required: true,
        type: [{ type: Types.ObjectId, ref: "Bookshelve" }],
        default: [],
    })
    bookshelves: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
