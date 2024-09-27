// This file is auto-generated from types.json. Do not modify manually.

export interface Highlight {
  id: string;
  startingX: number;
  startingY: number;
  endX: number;
  endY: number;
}

export interface RectElement {
  fillStyle: string;
  roughness: number;
  seed: number;
  hachureGap: number;
  hachureAngle: number;
}

export interface TextElement {
  text: string;
  fontFamily: string;
  fontSize: number;
}

export interface ArrowElement {
  startId: string;
  endId: string;
  startType: StartType;
  endType: StartType;
}

export interface Book {
  title: string;
  userId: ObjectId;
  description: string;
  author: string;
  genre: string[];
  imageUrl: string;
  liked: boolean;
  dateAdded: Date;
  bookElements: any[];
  highlights: Highlight[];
  canvaElements: (RectElement | TextElement)[];
  curveElements: ArrowElement[];
  scale: number;
  offsetPosition: { x: number; y: number; };
}

export type StartType = 'start' | 'end';
export type ObjectId = string;
