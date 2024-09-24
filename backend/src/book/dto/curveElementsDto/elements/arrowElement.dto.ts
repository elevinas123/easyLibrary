// src/books/dto/arrow-element.dto.ts

import {IsArray, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import { CurveElementSkeletonDto } from '../curveElementSkeleton.dto';


export type StartType = 'bookText'|'text'|null;

export class ArrowElementDto extends CurveElementSkeletonDto {
  @IsString() @IsEnum(['arrow']) type: 'arrow';

  @IsOptional() @IsString() startId: string|null;

  @IsOptional() @IsString() endId: string|null;

  @IsString() @IsEnum(['bookText', 'text']) startType: StartType;

  @IsString() @IsEnum(['bookText', 'text']) endType: StartType;
}
