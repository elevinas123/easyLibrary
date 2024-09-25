import {IsNumber} from 'class-validator';

export class OffsetPositionDto {
  @IsNumber() x: number;
  @IsNumber() y: number;
}