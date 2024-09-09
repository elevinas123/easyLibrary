import { atom } from "jotai";
import { DrawingToolNames } from "./components/Tools";

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

export const highlightsAtom = atom<Highlight[]>([])
export const currentHighlightIdAtom = atom<string| null>(null);