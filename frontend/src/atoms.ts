import { atom } from "jotai";
import { HighlightRange } from "./preprocess/epub/preprocessEpub";

export const userNameAtom = atom<string | null>(null);
