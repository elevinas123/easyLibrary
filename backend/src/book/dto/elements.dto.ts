import {Type} from 'class-transformer';
import {IsArray, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';

// DTO for HighlightPoints (assuming it's a complex object)
export class HighlightPointsDto {
  // Add validation rules for HighlightPoints based on its structure
  // For example:
  @IsNumber() x: number;

  @IsNumber() y: number;
}

// Base skeleton DTO for all Canva elements
export class CanvaElementSkeletonDto {
  @IsString() id: string;

  @IsString() fill: string;

  @IsNumber() x: number;

  @IsNumber() y: number;

  @IsNumber() width: number;

  @IsNumber() height: number;

  @IsArray() @IsString({each: true}) outgoingArrowIds: string[];

  @IsArray() @IsString({each: true}) incomingArrowIds: string[];

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => HighlightPointsDto)
  points: HighlightPointsDto[];

  @IsString() strokeColor: string;

  @IsNumber() strokeWidth: number;

  @IsNumber() opacity: number;
}
export class TextElementDto extends CanvaElementSkeletonDto {
  @IsString() type: 'text';  // Discriminator for 'text'

  @IsString() text: string;

  @IsString() fontFamily: string;

  @IsNumber() fontSize: number;
}
export class RectElementDto extends CanvaElementSkeletonDto {
  @IsString() type: 'rect';  // Discriminator for 'rect'
}
export class CanvaElementDto {
  @ValidateNested()
  @Type(() => TextElementDto, {
    discriminator: {
      property: 'type',
      subTypes:
          [
            {value: TextElementDto, name: 'text'},
            {value: RectElementDto, name: 'rect'}
          ],
    },
    keepDiscriminatorProperty: true,  // Keep the `type` field
  })
  element: TextElementDto|RectElementDto;
}

export class CanvaElementsDto {
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CanvaElementDto)
  canvaElements: CanvaElementDto[];
}
