import { getModelForClass, prop } from "@typegoose/typegoose";


export class OffsetPosition {
    @prop({required: true}) x!: number;

    @prop({required: true}) y!: number;
}

export const OffsetPositionModel = getModelForClass(OffsetPosition);