<<<<<<< HEAD
import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Book } from "src/book/schema/book.schema";
import { Bookshelve } from "src/bookshelve/schema/bookshelve-schema";

export type UserDocument = User & Document;

@modelOptions({ schemaOptions: { _id: true } })
export class User {
    @prop({ type: () => Types.ObjectId, required: true, auto: true })
    _id!: Types.ObjectId;
=======
// src/cats/schemas/cat.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

export type UserType = {
    _id: Types.ObjectId;
    username: string;
    age: number;
    password: string;
    comment: string;
    books: Types.ObjectId[];
    bookshelves: Types.ObjectId[];
};
@Schema()
export class User implements UserType {
    @Prop({ type: Types.ObjectId, required: true, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true }) username: string;
>>>>>>> MongooseBackend

    @prop({ required: true }) username!: string;

    @prop({ required: true }) age!: number;

    @prop({ required: true }) password!: string;

    @prop() comment?: string;

    // Reference to books in the Book collection
    @prop({ ref: () => Book, type: () => [Types.ObjectId], default: [] })
    books!: Types.ObjectId[];

    // Reference to bookshelves in the Bookshelve collection
    @prop({ ref: () => Bookshelve, type: () => [Types.ObjectId], default: [] })
    bookshelves!: Types.ObjectId[];
}

// Create the model for User
export const UserModel = getModelForClass(User);
