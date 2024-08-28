import { atom } from "jotai";
import { DrawingToolNames } from "./components/Tools";

export const activeToolAtom = atom<DrawingToolNames>("Select");
export const stageStateAtom = atom({
    isDrawing: false,
    currentShape: null,
});