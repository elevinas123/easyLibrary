// rect-element.schema.ts
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

import {CanvaElementSkeleton, CanvaElementSkeletonSchema, CanvaElementSkeletonType,} from '../canvaElementSkeleton.schema';

export interface CircleElementType extends CanvaElementSkeletonType {
  type: 'circle';
  fillStyle: string;
  roughness: number;
  seed: number;
  hachureGap: number;
  hachureAngle: number;
  radius: number;
}

@Schema({_id: false})
export class CircleElement extends CanvaElementSkeleton implements
    CircleElementType {
  @Prop({required: true}) fillStyle!: string;

  @Prop({required: true}) roughness!: number;

  @Prop({required: true}) seed!: number;

  @Prop({required: true}) hachureGap!: number;

  @Prop({required: true}) hachureAngle!: number;

  @Prop({required: true}) radius!: number;

  get type(): 'circle' {
    return 'circle';
  }
}

export type CircleElementDocument = CircleElement&Document;
export const CircleElemenetSchema = SchemaFactory.createForClass(CircleElement);
CanvaElementSkeletonSchema.discriminator('circle', CircleElemenetSchema);
