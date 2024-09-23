import { atom } from "jotai";
import { HighlightRange } from "./preprocess/epub/preprocessEpub";

export type User = {
    _id: string;
    username: string;
    email: string;
    password: string;
    books: string[];
    highlights: HighlightRange[];
};
export const userAtom = atom<User | null>(null);
export const accessTokenAtom = atom<string | null>(null);
