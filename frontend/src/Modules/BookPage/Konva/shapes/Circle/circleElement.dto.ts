// src/books/dto/rect-element.dto.ts

import {IsEnum, IsNumber, IsString} from 'class-validator';

import {CanvaElementSkeletonDto} from '../../../../../../../backend/src/book/dto/canvaElementsDto/canvaElementSkeleton.dto';

import {CircleElementType} from './circleElement.schema';

export class CircleElementDto extends CanvaElementSkeletonDto implements
    CircleElementType {
  @IsString() @IsEnum(['circle']) type!: 'circle';

  @IsNumber() roughness!: number;

  @IsNumber() seed!: number;

  @IsString() fillStyle!: string;

  @IsNumber() hachureGap!: number;

  @IsNumber() hachureAngle!: number;

  @IsNumber() radius!: number;
}
