import { atom } from "jotai";

import { DrawingToolNames } from "./components/Tools";
import {
    ArrowElementType,
    RectElementType,
    TextElementType,
} from "../../../endPointTypes/types";

export const activeToolAtom = atom<DrawingToolNames>("Select");
export const stageStateAtom = atom({
    isDrawing: false,
    currentShape: null,
});
export const offsetPositionAtom = atom({
    x: 0,
    y: 0,
});

type CanvaElement = TextElementType | RectElementType;

export const highlightsAtom = atom<Highlight[]>([]);
export const currentHighlightIdAtom = atom<string | null>(null);
export const arrowsAtom = atom<ArrowElementType[]>([]);
export const hoveredItemsAtom = atom<ArrowElementType[]>([]);
export const newArrowAtom = atom<ArrowElementType | null>(null);
export const canvaElementsAtom = atom<CanvaElement[]>([]);
export const selectedArrowIdsAtom = atom<string[]>([]);
export const selectedItemsIdsAtom = atom<string[]>([]);
export const scaleAtom = atom(1);
