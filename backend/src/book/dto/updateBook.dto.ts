import {PartialType} from '@nestjs/mapped-types';

import {HighlightDto} from '../../../../frontend/src/Modules/BookPage/Konva/modules/BookTextLayers/highlights.dto';
import {ProcessedElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/modules/BookTextLayers/processedElement.dto';
import {ArrowElementDto} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/Arrow/arrowElement.dto';
import {CanvaElementType} from '../../../../frontend/src/Modules/BookPage/Konva/shapes/canvaElementSkeleton.schema';

import {ChaptersDataDto} from './chaptersData/chaptersData.dto';
import {CreateBookDto} from './createBookDto';

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
