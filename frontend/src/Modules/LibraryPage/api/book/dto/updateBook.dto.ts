import {PartialType} from '@nestjs/mapped-types';

import {ArrowElementDto} from '../../../../BookPage/Konva/shapes/Arrow/arrowElement.dto';
import {CanvaElementType} from '../../../../BookPage/Konva/shapes/canvaElementSkeleton.schema';

import {ChaptersDataDto} from './chaptersData/chaptersData.dto';
import {CreateBookDto} from './createBookDto';
import { ProcessedElementDto } from '../../../../BookPage/Konva/modules/BookTextLayers/processedElement.dto';
import { HighlightDto } from '../../../../BookPage/Konva/modules/BookTextLayers/highlights.dto';

export class UpdateBookDto extends PartialType
(CreateBookDto) {
  bookElements?: ProcessedElementDto[];
  canvaElements?: CanvaElementType[];
  curveElements?: ArrowElementDto[];
  highlights?: HighlightDto[];
  liked?: boolean;
  scale?: number;
  offsetPosition?: {x: number; y: number};
  chaptersData?: ChaptersDataDto[];
}
