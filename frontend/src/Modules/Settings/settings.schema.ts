import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

// Define the SettingsDocument type
export type SettingsDocument = Settings & Document;

// Define the SettingsType interface
export type SettingsType = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    backgroundColor: string;
    textColor: string;
    darkMode: boolean;
};

@Schema()
export class Settings implements Omit<SettingsType, "_id"> {
    @Prop({ type: Types.ObjectId, required: true, ref: "User" })
    // Reference to the User model
    userId!: Types.ObjectId;

    @Prop({ type: Number, default: 16 }) fontSize!: number;

    @Prop({ type: String, default: "Arial" }) fontFamily!: string;

    @Prop({ type: Number, default: 3 }) lineHeight!: number;

    @Prop({ type: String, default: "#111111" }) backgroundColor!: string;

    @Prop({ type: String, default: "#ffffff" }) textColor!: string;

    @Prop({ type: Boolean, default: false }) darkMode!: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
