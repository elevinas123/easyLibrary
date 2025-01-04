import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ChaptersDataDocument = ChaptersData & Document;

export type ChaptersDataType = {
    id: string;
    title: string;
    href: string | null;
    indentLevel: number | null;
};
@Schema({ _id: false })
export class ChaptersData implements ChaptersDataType {
    @Prop({ required: true }) id!: string;
    @Prop({ required: true }) title!: string;
    @Prop({ type: String, default: null, required: true }) href!: string | null;
    @Prop({ type: Number, default: null, required: true }) indentLevel!:
        | number
        | null;
}
export const ChaptersDataSchema = SchemaFactory.createForClass(ChaptersData);
