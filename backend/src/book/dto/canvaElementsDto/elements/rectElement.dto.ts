// src/books/dto/rect-element.dto.ts

import {IsEnum, IsString} from 'class-validator';
import { CanvaElementSkeletonDto } from '../canvaElementSkeleton.dto';


export class RectElementDto extends CanvaElementSkeletonDto {
  @IsString() @IsEnum(['rect']) type: 'rect';
}
