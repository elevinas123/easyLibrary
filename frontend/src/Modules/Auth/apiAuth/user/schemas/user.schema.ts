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
    _id!: Types.ObjectId;

    @Prop({ type: String, required: true }) // Explicitly define the type as String
    username!: string;

    @Prop({ type: Number, required: true }) // Explicitly define the type as Number
    age!: number;

    @Prop({ type: String, required: true }) // Explicitly define the type as String
    password!: string;

    @Prop({ type: String }) // Explicitly define the type as String
    comment!: string;

    @Prop({
        required: true,
        type: [{ type: Types.ObjectId, ref: "Book" }],
        default: [],
    })
    books!: Types.ObjectId[];

    @Prop({
        required: true,
        type: [{ type: Types.ObjectId, ref: "Bookshelve" }],
        default: [],
    })
    bookshelves!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
