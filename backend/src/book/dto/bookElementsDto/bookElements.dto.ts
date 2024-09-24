
import {Type} from 'class-transformer';
import {IsArray, ValidateNested} from 'class-validator';
import { ProcessedElementDto } from './processedElement.dto';


export class BookElementsDto {
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ProcessedElementDto)
  bookElements: ProcessedElementDto[];
}
