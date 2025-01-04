// src/books/dto/create-book.dto.ts

import {Type} from 'class-transformer';
import {IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested,} from 'class-validator';
import {Types} from 'mongoose';

import {BookTextElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/modules/BookTextLayers/bookTextElement.dto';
import {HighlightDto} from '../../../../frontend/src/Modules/BookPage/Konva/modules/BookTextLayers/highlights.dto';
import {ProcessedElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/modules/BookTextLayers/processedElement.dto';
import {OffsetPositionDto} from '../../../../frontend/src/Modules/BookPage/Konva/offsetPosition.dto';
import {ArrowElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/Arrow/arrowElement.dto';
import {CanvaElementType} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/canvaElementSkeleton.schema';
import {CircleElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/Circle/circleElement.dto';
import {RectElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/Rectangle/rectElement.dto';
import {TextElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/Text/textElement.dto';
import {BookType} from '../schema/book.schema';

import {ChaptersDataDto} from './chaptersData/chaptersData.dto';

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
