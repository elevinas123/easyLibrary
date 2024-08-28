import { atom } from "jotai";
import { HighlightRange } from "./preprocess/epub/preprocessEpub";

export const highlightedRangeAtom = atom<HighlightRange[]>([]);
