// src/books/dto/create-book.dto.ts

import {Type} from 'class-transformer';
import {IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested,} from 'class-validator';
import {Types} from 'mongoose';

import {BookTextElementDto} from '../../../../BookPage/Konva/modules/BookTextLayers/bookTextElement.dto';
import {OffsetPositionDto} from '../../../../BookPage/Konva/offsetPosition.dto';
import {ArrowElementDto} from '../../../../BookPage/Konva/shapes/Arrow/arrowElement.dto';
import {CanvaElementType} from '../../../../BookPage/Konva/shapes/canvaElementSkeleton.schema';
import {CircleElementDto} from '../../../../BookPage/Konva/shapes/Circle/circleElement.dto';
import {TextElementDto} from '../../../../BookPage/Konva/shapes/Text/textElement.dto';
import {BookType} from '../schema/book.schema';

import {ChaptersDataDto} from './chaptersData/chaptersData.dto';
import { ProcessedElementDto } from '../../../../BookPage/Konva/modules/BookTextLayers/processedElement.dto';
import { HighlightDto } from '../../../../BookPage/Konva/modules/BookTextLayers/highlights.dto';
import { RectElementDto } from '../../../../BookPage/Konva/shapes/Rectangle/rectElement.dto';

export class CreateBookDto implements Omit<BookType, '_id'> {
  @IsString() @IsNotEmpty() title!: string;

  @IsString()
  @IsNotEmpty()
  userId!: Types.ObjectId;  // Will be converted to ObjectId in the service

  @IsString() @IsNotEmpty() description!: string;

  @IsString() @IsNotEmpty() author!: string;

  @IsArray() @IsString({each: true}) genre!: string[];

  @IsString() @IsNotEmpty() imageUrl!: string;

  @IsBoolean() liked!: boolean;

  @IsDateString() dateAdded!: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ProcessedElementDto)
  bookElements!: ProcessedElementDto[];

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => HighlightDto)  // First type
  highlights!: HighlightDto[];

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => TextElementDto)      // First type
  @Type(() => RectElementDto)      // Second type
  @Type(() => BookTextElementDto)  // Second type
  @Type(() => CircleElementDto)    // Second type
  canvaElements!: CanvaElementType[];
  @IsNumber() scale!: number;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ArrowElementDto)  // Currently only ArrowElement
  curveElements!: ArrowElementDto[];

  @ValidateNested()
  @Type(() => OffsetPositionDto)
  offsetPosition!: OffsetPositionDto;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ChaptersDataDto)  // Second type
  chaptersData!: ChaptersDataDto[];
}
