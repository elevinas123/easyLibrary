import { atom } from "jotai";
import {
    ArrowElement,
    Highlight,
    HighlightPoints,
    RectElement,
    TextElement,
} from "../../../endPointTypes/types";
import { HighlightRect } from "./modules/BookTextLayers/HighlightLayer";
import { DrawingToolNames } from "./components/Tools";

export type ArrowHover = {
    points: HighlightPoints[];
    id: string;
    rects?: HighlightRect[];
};

export const activeToolAtom = atom<DrawingToolNames>("Select");
export const stageStateAtom = atom({
    isDrawing: false,
    currentShape: null,
});
export const offsetPositionAtom = atom({
    x: 0,
    y: 0,
});

export type CanvaElement = RectElement | TextElement;

export type TextItem = {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    isSelected: boolean;
    width: number;
    height: number;
};
export const highlightsAtom = atom<Highlight[]>([]);
export const currentHighlightIdAtom = atom<string | null>(null);
export const arrowsAtom = atom<ArrowElement[]>([]);
export const hoveredItemsAtom = atom<ArrowHover[]>([]);
export const newArrowAtom = atom<ArrowElement | null>(null);
export const canvaElementsAtom = atom<CanvaElement[]>([]);
export const selectedArrowIdsAtom = atom<string[]>([]);
export const selectedItemsIdsAtom = atom<string[]>([]);
export const scaleAtom = atom(1);
