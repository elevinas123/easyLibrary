// book.schema.ts
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

import {HighlightSchema, HighlightType} from '../../../../BookPage/Konva/modules/BookTextLayers/highlights.schema';
import {OffsetPositionSchema, OffsetPositionType,} from '../../../../BookPage/Konva/offsetPosition.schema';
import {ArrowElementType} from '../../../../BookPage/Konva/shapes/Arrow/arrowElement.schema';
import {CurveElementSkeletonSchema} from '../../../../BookPage/Konva/shapes/Arrow/curveElementSkeleton';
import {CanvaElementSkeletonSchema, CanvaElementType,} from '../../../../BookPage/Konva/shapes/canvaElementSkeleton.schema';

import {ProcessedElementSchema, ProcessedElementType,} from './bookElements/processedElement.schema';
import {ChaptersDataSchema, ChaptersDataType,} from './chaptersData/chaptersData.schema';

export type BookDocument = Book&Document;

export type BookType = {
  _id: Types.ObjectId; title: string; userId: Types.ObjectId;
  description: string;
  author: string;
  genre: string[];
  imageUrl: string;
  liked: boolean;
  dateAdded: string;
  bookElements: ProcessedElementType[];
  highlights: HighlightType[];
  canvaElements: CanvaElementType[];
  curveElements: ArrowElementType[];
  chaptersData: ChaptersDataType[];
  scale: number;
  offsetPosition: OffsetPositionType;
};
@Schema()
export class Book implements
    Omit<BookType, '_id'|'canvaElements'|'curveElements'> {
  @Prop({type: String, required: true}) title!: string;

  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  userId!: Types.ObjectId;

  @Prop({type: String, required: true}) description!: string;

  @Prop({type: String, required: true}) author!: string;

  @Prop({type: [String], required: true}) genre!: string[];

  @Prop({type: String, required: true}) imageUrl!: string;

  @Prop({type: Boolean, required: true}) liked!: boolean;

  @Prop({type: String, required: true}) dateAdded!: string;

  @Prop({
    type: [ProcessedElementSchema],
    required: true,
  })
  bookElements!: ProcessedElementType[];

  @Prop({type: [HighlightSchema], required: true}) highlights!: HighlightType[];

  @Prop({type: [CanvaElementSkeletonSchema], required: true})
  canvaElements!: CanvaElementType[];

  @Prop({
    type: [CurveElementSkeletonSchema],
    required: true,
  })
  curveElements!: ArrowElementType[];

  @Prop({type: Number, required: true}) scale!: number;

  @Prop({
    type: {offsetPosition: OffsetPositionSchema},
  })
  offsetPosition!: OffsetPositionType;

  @Prop({
    type: [ChaptersDataSchema],
    required: true,
  })
  chaptersData!: ChaptersDataType[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
