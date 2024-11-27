import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type OffsetPositionType = {
    x: number;
    y: number;
};

export type OffsetPositionDocument = OffsetPosition & Document;

@Schema({ _id: false })
export class OffsetPosition implements OffsetPositionType {
    @Prop({ required: true }) x!: number;
    @Prop({ required: true }) y!: number;
}
export const OffsetPositionSchema =
    SchemaFactory.createForClass(OffsetPosition);
