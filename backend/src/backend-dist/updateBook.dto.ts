import {PartialType} from '@nestjs/mapped-types';

import {ArrowElementDto} from './arrowElement.dto';
import {CanvaElementType} from './canvaElementSkeleton.schema';

import {ChaptersDataDto} from './chaptersData.dto';
import {CreateBookDto} from './createBookDto';
import { ProcessedElementDto } from './processedElement.dto';
import { HighlightDto } from './highlights.dto';

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
