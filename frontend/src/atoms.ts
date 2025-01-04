import { atom } from "jotai";
import { User } from "./endPointTypes/types";

export const userAtom = atom<User | undefined>(undefined);
export const accessTokenAtom = atom<string | undefined>(undefined);
