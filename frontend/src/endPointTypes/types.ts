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
  books: string[];
  bookshelves: string[];
}

export interface ProcessedElement {
  text: string;
  lineX: number;
  lineWidth: number;
  lineY: number;
}

export interface Highlight {
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

export interface CanvaElementSkeleton {
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
  rotation: number;
}

export interface RectElement extends CanvaElementSkeleton {
  fillStyle: string;
  roughness: number;
  seed: number;
  hachureGap: number;
  hachureAngle: number;
  type: "rect";
}

export interface TextElement extends CanvaElementSkeleton {
  text: string;
  fontFamily: string;
  fontSize: number;
  type: "text";
}

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
  startType: StartType;
  endType: StartType;
  type: "arrow";
}

export interface OffsetPosition {
  x: number;
  y: number;
}

export interface Book {
  _id: string;
  title: string;
  userId: string;
  description: string;
  author: string;
  genre: string[];
  imageUrl: string;
  liked: boolean;
  dateAdded: string;
  bookElements: ProcessedElement[];
  highlights: Highlight[];
  canvaElements: (RectElement | TextElement)[];
  curveElements: ArrowElement[];
  scale: number;
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
}

export interface ProcessedElementDto {
  text: string;
  lineX: number;
  lineWidth: number;
  lineY: number;
}

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

export interface CurveElementSkeletonDto {
  points: number[];
  id: string;
  fill: string;
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

export interface ArrowElementDto extends CurveElementSkeletonDto {
  type: "arrow";
  startId: string | null;
  endId: string | null;
  startType: StartType;
  endType: StartType;
}

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
  liked: boolean;
  dateAdded: string;
  bookElements: ProcessedElementDto[];
  canvaElements: (RectElementDto | TextElementDto)[];
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

export type ObjectId = string;
