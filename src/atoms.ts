import { atom } from "jotai";
import { HighlightRange } from "./Modules/BookPage/preprocessEpub";


export const highlightedRangeAtom = atom<HighlightRange[]>([])