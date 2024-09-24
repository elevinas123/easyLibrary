// src/books/dto/curve-element-skeleton.dto.ts

import {IsArray, IsNumber, IsOptional, IsString} from 'class-validator';

export class CurveElementSkeletonDto {
  @IsArray() @IsNumber({}, {each: true}) points: number[];

  @IsString() id: string;

  @IsString() fill: string;

  @IsOptional() @IsString() text: string|null;
}
