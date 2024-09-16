import { atom } from "jotai";
import { DrawingToolNames } from "./components/Tools";
import { HighlightRect } from "./modules/BookTextLayers/HighlightLayer";
import { ArrowElement } from "./KonvaStage";
import { CanvaElement } from "./shapes/CanvasElement";

export type ArrowHover = {
    points: HighlightPoints[];
    id: string;
    rects?: HighlightRect[];
};

export type HighlightPoints = {
    x: number;
    y: number;
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
export type Highlight = {
    id: string;
    startingX: number;
    startingY: number;
    endX: number;
    endY: number;
};

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
export const textItemsAtom = atom<TextItem[]>([]);
export const hoveredItemsAtom = atom<ArrowHover[]>([]);
export const newArrowAtom = atom<ArrowElement | null>(null);
export const canvaElementsAtom = atom<CanvaElement[]>([]);
export const selectedArrowIdsAtom = atom<string[]>([]);