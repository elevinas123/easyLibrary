import { atom } from "jotai";
import { HighlightRange } from "./Modules/BookPage/MainPage";


export const highlightedRangeAtom = atom<HighlightRange[]>([])