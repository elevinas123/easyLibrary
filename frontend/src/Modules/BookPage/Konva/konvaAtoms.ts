import { atom } from "jotai";

import {
    ArrowElement,
    CanvaElementSkeleton,
    Highlight,
    Settings,
    SpecificArrowElement,
} from "../../../endPointTypes/types";
import { DrawingToolNames } from "./components/Tools";
import { HighlightRect } from "./modules/BookTextLayers/HighlightLayer";

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
export type CurrentHighlight = {
    id: string | null;
    editing: boolean;
    creating: boolean;
    mousePosition: { x: number; y: number };
    offsetPosition: { x: number; y: number };
};

export const highlightsAtom = atom<Highlight[]>([]);
export const currentHighlightAtom = atom<CurrentHighlight>({
    id: null,
    editing: false,
    creating: false,
    mousePosition: { x: 0, y: 0 },
    offsetPosition: { x: 0, y: 0 },
});
export const arrowsAtom = atom<SpecificArrowElement[]>([]);
export const hoveredItemsAtom = atom<ArrowHover[]>([]);
export const newArrowAtom = atom<SpecificArrowElement | null>(null);
export const canvaElementsAtom = atom<CanvaElementSkeleton[]>([]);
export const selectedArrowIdsAtom = atom<string[]>([]);
export const selectedItemsIdsAtom = atom<string[]>([]);
export const scaleAtom = atom(1);
export const bookIdAtom = atom<string | null>(null);
export const settingsAtom = atom<Settings | undefined>(undefined);
