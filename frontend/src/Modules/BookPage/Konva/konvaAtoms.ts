import { atom } from "jotai";
<<<<<<< HEAD
import {
    ArrowElement,
    Highlight,
    HighlightPoints,
    RectElement,
    TextElement,
} from "../../../endPointTypes/types";
import { HighlightRect } from "./modules/BookTextLayers/HighlightLayer";
import { DrawingToolNames } from "./components/Tools";
=======

import {
    ArrowElementType,
    CanvaElementType,
    HighlightType
} from "../../../endPointTypes/types";
import { DrawingToolNames } from "./components/Tools";
import { HighlightRect } from "./modules/BookTextLayers/HighlightLayer";
>>>>>>> MongooseBackend

export type ArrowHover = {
    points: HighlightPoints[];
    id: string;
    rects?: HighlightRect[];
};

<<<<<<< HEAD
=======
export type HighlightPoints = {
    x: number;
    y: number;
};

>>>>>>> MongooseBackend
export const activeToolAtom = atom<DrawingToolNames>("Select");
export const stageStateAtom = atom({
    isDrawing: false,
    currentShape: null,
});
export const offsetPositionAtom = atom({
    x: 0,
    y: 0,
});
<<<<<<< HEAD

export type CanvaElement = RectElement | TextElement;
=======
>>>>>>> MongooseBackend

export const highlightsAtom = atom<HighlightType[]>([]);
export const currentHighlightIdAtom = atom<string | null>(null);
export const arrowsAtom = atom<ArrowElementType[]>([]);
export const hoveredItemsAtom = atom<ArrowHover[]>([]);
export const newArrowAtom = atom<ArrowElementType | null>(null);
export const canvaElementsAtom = atom<CanvaElementType[]>([]);
export const selectedArrowIdsAtom = atom<string[]>([]);
export const selectedItemsIdsAtom = atom<string[]>([]);
export const scaleAtom = atom(1);
