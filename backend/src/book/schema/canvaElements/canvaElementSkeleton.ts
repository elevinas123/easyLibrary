import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { HighlightPoints } from "./highlightPoints.schema";

@modelOptions({ schemaOptions: { discriminatorKey: "type", _id: false } })
export class CanvaElementSkeleton {
    @prop({ required: true }) fill!: string;

    @prop({ required: true }) x!: number;

    @prop({ required: true }) y!: number;

    @prop({ required: true }) width!: number;

    @prop({ required: true }) height!: number;

    @prop({ required: true }) id!: string;

    @prop({ type: () => [String], required: true }) outgoingArrowIds!: string[];

    @prop({ type: () => [String], required: true }) incomingArrowIds!: string[];

    @prop({ type: () => [HighlightPoints], required: true })
    points!: HighlightPoints[];

    @prop({ required: true }) strokeColor!: string;

    @prop({ required: true }) strokeWidth!: number;

    @prop({ required: true }) opacity!: number;

    @prop({ required: true }) rotation!: null;

    // `type` will be set by the discriminator, not directly in the base class
}

export const CanvaElementModel = getModelForClass(CanvaElementSkeleton);
