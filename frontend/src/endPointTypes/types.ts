// This file is auto-generated from types.json. Do not modify manually.

export interface User {
  _id: string;
  username: string;
  age: number;
  password: string;
  comment: string;
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

export interface HighlightPointsType {
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
  points: HighlightPointsType[];
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface CircleElementType extends CanvaElementSkeletonType {
  type: "circle";
  fillStyle: string;
  roughness: number;
  seed: number;
  hachureGap: number;
  hachureAngle: number;
  radius: number;
}

export interface RectElementType extends CanvaElementSkeletonType {
  type: "rect";
  fillStyle: string;
  roughness: number;
  seed: number;
  hachureGap: number;
  hachureAngle: number;
}

export interface TextElementType extends CanvaElementSkeletonType {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
}

export interface BookTextElementType extends CanvaElementSkeletonType {
  type: "bookText";
  text: string;
  fontSize: number;
  fontFamily: string;
}

export type CanvaElementType = CircleElementType | RectElementType | TextElementType | BookTextElementType;

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
  startType: StartType;
  endType: StartType;
}

export interface OffsetPositionType {
  x: number;
  y: number;
}

export interface ChaptersDataType {
  id: string;
  title: string;
  href: (string | null);
  indentLevel: (number | null);
}

export interface Book {
  title: string;
  userId: string;
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
  offsetPosition: OffsetPositionType;
  chaptersData: ChaptersDataType[];
}

export interface CurveElementSkeletonDto {
  points: number[];
  id: string;
  fill: string;
  text: (null | string);
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
  startId: (null | string);
  endId: (null | string);
  startType: (null | "text" | "bookText");
  endType: (null | "text" | "bookText");
}

export interface ChaptersDataDto {
  id: string;
  title: string;
  href: string;
  indentLevel: (null | number);
}

export interface UpdateBookDto extends Partial<CreateBookDto> {
  bookElements?: undefined | ProcessedElementDto[];
  canvaElements?: undefined | CanvaElementType[];
  curveElements?: undefined | ArrowElementDto[];
  highlights?: undefined | HighlightDto[];
  liked?: (undefined | false | true);
  scale?: (undefined | number);
  offsetPosition?: (undefined | { x: number; y: number; });
  chaptersData?: undefined | ChaptersDataDto[];
}

export interface OffsetPositionDto {
  x: number;
  y: number;
}

export interface CreateBookDto {
  title: string;
  userId: string;
  description: string;
  author: string;
  genre: string[];
  imageUrl: string;
  liked: (false | true);
  dateAdded: string;
  bookElements: ProcessedElementDto[];
  highlights: HighlightDto[];
  canvaElements: CanvaElementType[];
  scale: number;
  curveElements: ArrowElementDto[];
  offsetPosition: OffsetPositionDto;
  chaptersData: ChaptersDataDto[];
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
  books: ObjectId[];
}

export type ObjectId = string;
