import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    CanvaElementSkeleton,
    CanvaElementSkeletonSchema,
    CanvaElementSkeletonType,
} from "../canvaElementSkeleton.schema";

export interface BookTextElementType extends CanvaElementSkeletonType {
    type: "bookText";
    text: string;
    fontSize: number;
    fontFamily: string;
}

@Schema({ _id: false })
export class BookTextElement
    extends CanvaElementSkeleton
    implements BookTextElementType
{
    @Prop({ required: true }) text: string;

    @Prop({ required: true }) fontSize: number;

    @Prop({ required: true }) fontFamily: string;

    get type(): "bookText" {
        return "bookText";
    }
}

export type BookTextElementDocument = BookTextElement & Document;
export const BookTextElementSchema =
    SchemaFactory.createForClass(BookTextElement);
CanvaElementSkeletonSchema.discriminator("bookText", BookTextElementSchema);
