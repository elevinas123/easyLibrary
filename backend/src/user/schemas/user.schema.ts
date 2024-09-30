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
