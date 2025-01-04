// Types for Prisma Models

import { SpecificTextElement } from "../Modules/BookPage/Konva/shapes/Text/TextElement";

export type Settings = {
    id: string;
    userId: string;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    backgroundColor: string;
    textColor: string;
    darkMode: boolean;
    user?: User; // Optional reference
};

export type User = {
    id: string;
    username: string;
    password: string;
    comment?: string;
    books?: Book[]; // Optional reference array
    bookshelves?: Bookshelve[]; // Optional reference array
    settings?: Settings; // Optional reference
};

export type Genre = {
    id: string;
    name: string;
    books?: BookGenre[]; // Optional reference array
};

export type BookGenre = {
    bookId: string;
    genreId: string;
    book?: Book; // Optional reference
    genre?: Genre; // Optional reference
};

export type Book = {
    id: string;
    title: string;
    description: string;
    author: string;
    genres?: BookGenre[]; // Optional reference array
    bookshelves?: Bookshelve[]; // Optional reference array
    imageUrl: string;
    liked: boolean;
    dateAdded: Date;
    scale: number;
    offsetPosition?: OffsetPosition; // Optional reference
    userId: string;
    user?: User; // Optional reference
    bookElements?: ProcessedElement[]; // Optional reference array
    highlights?: Highlight[]; // Optional reference array
    canvaElements?: CanvaElementSkeleton[]; // Optional reference array
    curveElements?: CurveElementSkeleton[]; // Optional reference array
    chaptersData?: ChaptersData[]; // Optional reference array
};

export type Bookshelve = {
    id: string;
    name: string;
    createdAt: Date;
    userId: string;
    user?: User; // Optional reference
    books?: Book[]; // Optional reference array
};

export type ProcessedElement = {
    id: string;
    text: string;
    lineX: number;
    lineWidth: number;
    lineY: number;
    bookId: string;
    book?: Book; // Optional reference
};

export type Highlight = {
    id: string;
    startingX: number;
    startingY: number;
    endX: number;
    endY: number;
    bookId: string;
    book?: Book; // Optional reference
};

export type OffsetPosition = {
    id: string;
    x: number;
    y: number;
    bookId: string;
    book?: Book; // Optional reference
};

export type ChaptersData = {
    id: string;
    title: string;
    href?: string;
    indentLevel?: number;
    bookId: string;
    book?: Book; // Optional reference
};

export type Point = {
    id?: string;
    x: number;
    y: number;
    curveId?: string;
    canvaId?: string;
    curve?: CurveElementSkeleton; // Optional reference
    canva?: CanvaElementSkeleton; // Optional reference
};

export type CanvaElementSkeleton = {
    id: string;
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
    type: "text" | "rect" | "circle";
    rotation: number;
    points?: Point[]; // Optional reference array
    outgoingArrows?: ArrowElement[]; // Optional reference array
    incomingArrows?: ArrowElement[]; // Optional reference array
    outgoingArrowIds?: string[]; // Optional reference array
    incomingArrowIds?: string[]; // Optional reference array
    bookId: string;
    book?: Book; // Optional reference
    circleElements?: CircleElement; // Optional reference array
    rectElement?: RectElement; // Optional reference array
    textElement?: TextElementType; // Optional reference array
};

export type CurveElementSkeleton = {
    id: string;
    points?: Point[]; // Optional reference array
    fill: string;
    text?: string;
    roughness: number;
    bowing: number;
    seed: number;
    strokeWidth: number;
    strokeStyle: string;
    stroke: string;
    fillStyle: string;
    fillWeight: number;
    hachureAngle: number;
    hachureGap: number;
    type: string;
    bookId: string;
    book?: Book; // Optional reference
    arrowElements?: ArrowElement[]; // Optional reference array
};

export type ArrowElement = {
    id: string;
    startId?: string;
    endId?: string;
    type: "Arrow";
    startType?: string;
    endType?: string;
    from?: CanvaElementSkeleton; // Optional reference
    to?: CanvaElementSkeleton; // Optional reference
    fromId: string;
    toId: string;
    curveId?: string;
    curve?: CurveElementSkeleton; // Optional reference
};

export type CircleElement = {
    id: string;
    fillStyle: string;
    roughness: number;
    seed: number;
    hachureGap: number;
    hachureAngle: number;
    radius: number;
    type: "Circle";
    canvaId: string;
    canva?: CanvaElementSkeleton; // Optional reference
};

export type RectElement = {
    id: string;
    fillStyle: string;
    roughness: number;
    seed: number;
    hachureGap: number;
    hachureAngle: number;
    type: "Rect";
    canvaId: string;
    canva?: CanvaElementSkeleton; // Optional reference
};

export type TextElementType = {
    id?: string;
    text: string;
    fontFamily: string;
    fontSize: number;
    type: "text";
    canvaId: string;
    canva?: CanvaElementSkeleton; // Optional reference
};
export type SpecificTextElement = CanvaElementSkeleton & {
    type: "text";
    textElement: TextElementType;
};
