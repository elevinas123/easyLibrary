import { atom } from "jotai";
import { User } from "./endPointTypes/types";

export const userAtom = atom<User | null>(null);
export const accessTokenAtom = atom<string | null>(null);
