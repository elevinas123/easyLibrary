// processedElement.dto.ts
import {IsNumber, IsString} from 'class-validator';

import {ProcessedElementType} from '../../../../../../../backend/src/book/schema/bookElements/processedElement.schema';

export class ProcessedElementDto implements ProcessedElementType {
  @IsString() text!: string;

  @IsNumber() lineX!: number;

  @IsNumber() lineWidth!: number;

  @IsNumber() lineY!: number;
}
