// processedElement.dto.ts
import {IsNumber, IsString} from 'class-validator';

export class ProcessedElementDto {
  @IsString() text: string;

  @IsNumber() lineX: number;

  @IsNumber() lineWidth: number;

  @IsNumber() lineY: number;
}
