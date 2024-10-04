// This file is auto-generated from types.json. Do not modify manually.

export interface User {
  _id: string;
  username: string;
  age: number;
  password: string;
  comment?: string | undefined;
  books: ObjectId[];
  bookshelves: ObjectId[];
}

export interface CreateUserDto {
  username: string;
  password: string;
  age: number;
  comment: string;
  books: ObjectId[];
  bookshelves: ObjectId[];
}

export interface ProcessedElementType {
  text: string;
  lineX: number;
  lineWidth: number;
  lineY: number;
}

export interface HighlightType {
  id: string;
  startingX: number;
  startingY: number;
  endX: number;
  endY: number;
}

export interface HighlightPoints {
  x: number;
  y: number;
}

export interface CanvaElementSkeletonType {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  outgoingArrowIds: string[];
  incomingArrowIds: string[];
  points: HighlightPoints[];
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface RectElementType extends CanvaElementSkeletonType {
  type: "rect";
  fillStyle: string;
  roughness: number;
  seed: number;
  hachureGap: number;
  hachureAngle: number;
  type: "rect";
}

export interface TextElementType extends CanvaElementSkeletonType {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  type: "text";
}

<<<<<<< HEAD
export interface CurveElementSkeleton {
  id: string;
  fill: string;
  points: number[];
  text?: string | null | undefined;
  roughness: number;
  bowing: number;
  seed: number;
  strokeWidth: number;
  strokeStyle: "solid" | "dashed" | "dotted";
  stroke: string;
  fillStyle: "solid" | "dashed" | "hachure" | "cross-hatch" | "zigzag" | "dots" | "zigzag-line";
  fillWeight: number;
  hachureAngle: number;
  hachureGap: number;
}

export type StartType = undefined | null | string;

export interface ArrowElement extends CurveElementSkeleton {
  startId: string | null;
  endId: string | null;
=======
export interface BookTextElementType extends CanvaElementSkeletonType {
  type: "bookText";
  text: string;
  fontSize: number;
  fontFamily: string;
}

export type CanvaElementType = RectElementType | TextElementType | BookTextElementType;

export interface CurveElementSkeletonType {
  points: number[];
  id: string;
  fill: string;
  text: (string | null);
  roughness: number;
  bowing: number;
  seed: number;
  strokeWidth: number;
  strokeStyle: ("solid" | "dashed" | "dotted");
  stroke: string;
  fillStyle: ("solid" | "dashed" | "hachure" | "cross-hatch" | "zigzag" | "dots" | "zigzag-line");
  fillWeight: number;
  hachureAngle: number;
  hachureGap: number;
}

export type StartType = null | "text" | "bookText";

export interface ArrowElementType extends CurveElementSkeletonType {
  type: "arrow";
  startId: (string | null);
  endId: (string | null);
>>>>>>> MongooseBackend
  startType: StartType;
  endType: StartType;
  type: "arrow";
}

export interface OffsetPosition {
  x: number;
  y: number;
}

export interface OffsetPositionType {
  x: number;
  y: number;
}

export interface Book {
  title: string;
  description: string;
  author: string;
  genre: string[];
  imageUrl: string;
  liked: (false | true);
  dateAdded: string;
  bookElements: ProcessedElementType[];
  highlights: HighlightType[];
  canvaElements: CanvaElementType[];
  curveElements: ArrowElementType[];
  scale: number;
<<<<<<< HEAD
  offsetPosition: OffsetPosition;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {
  bookElements?: ProcessedElementDto[] | undefined;
  canvaElements?: (RectElementDto | TextElementDto)[] | undefined;
  curveElements?: ArrowElementDto[] | undefined;
  highlights?: HighlightDto[] | undefined;
  liked?: boolean | undefined;
  scale?: number | undefined;
  offsetPosition?: OffsetPosition | undefined;
}

export interface HighlightDto {
  id: string;
  startingX: number;
  startingY: number;
  endX: number;
  endY: number;
=======
  offsetPosition: OffsetPositionType;
>>>>>>> MongooseBackend
}

export interface ProcessedElementDto {
  text: string;
  lineX: number;
  lineWidth: number;
  lineY: number;
}

<<<<<<< HEAD
export interface HighlightPointsDto {
  x: number;
  y: number;
}

export interface CanvaElementSkeletonDto {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  outgoingArrowIds: string[];
  incomingArrowIds: string[];
  points: HighlightPointsDto[];
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
}

export interface RectElementDto extends CanvaElementSkeletonDto {
  type: "rect";
  roughness: number;
  seed: number;
  fillStyle: string;
  hachureGap: number;
  hachureAngle: number;
}

export interface TextElementDto extends CanvaElementSkeletonDto {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
}

=======
>>>>>>> MongooseBackend
export interface CurveElementSkeletonDto {
  points: number[];
  id: string;
  fill: string;
<<<<<<< HEAD
  text?: string | null | undefined;
=======
  text: (null | string);
>>>>>>> MongooseBackend
  roughness: number;
  bowing: number;
  seed: number;
  strokeWidth: number;
  strokeStyle: ("solid" | "dashed" | "dotted");
  stroke: string;
  fillStyle: ("solid" | "dashed" | "hachure" | "cross-hatch" | "zigzag" | "dots" | "zigzag-line");
  fillWeight: number;
  hachureAngle: number;
  hachureGap: number;
}

export interface ArrowElementDto extends CurveElementSkeletonDto {
  type: "arrow";
<<<<<<< HEAD
  startId: string | null;
  endId: string | null;
  startType: StartType;
  endType: StartType;
}

=======
  startId: (null | string);
  endId: (null | string);
  startType: (null | "text" | "bookText");
  endType: (null | "text" | "bookText");
}

export interface HighlightDto {
  id: string;
  startingX: number;
  startingY: number;
  endX: number;
  endY: number;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {
  bookElements?: undefined | ProcessedElementDto[];
  canvaElements?: undefined | CanvaElementType[];
  curveElements?: undefined | ArrowElementDto[];
  highlights?: undefined | HighlightDto[];
  liked?: (undefined | false | true);
  scale?: (undefined | number);
  offsetPosition?: (undefined | { x: number; y: number; });
}

>>>>>>> MongooseBackend
export interface OffsetPositionDto {
  x: number;
  y: number;
}

export interface CreateBookDto {
  _id?: string | undefined;
  userId: string;
  highlights: HighlightDto[];
  title: string;
  description: string;
  author: string;
  genre: string[];
  imageUrl: string;
  liked: (false | true);
  dateAdded: string;
  bookElements: ProcessedElementDto[];
<<<<<<< HEAD
  canvaElements: (RectElementDto | TextElementDto)[];
=======
  highlights: HighlightDto[];
  canvaElements: CanvaElementType[];
  scale: number;
>>>>>>> MongooseBackend
  curveElements: ArrowElementDto[];
  scale: number;
  offsetPosition: OffsetPositionDto;
}

export interface Bookshelve {
  _id: string;
  name: string;
  createdAt: Date;
  books: ObjectId[];
}

export interface CreateBookshelveDto {
  name: string;
  createdAt: Date;
  books: string[];
}

export interface LoginDto {
  username: string;
  password: string;
}

export type ObjectId = string;
