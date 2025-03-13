import { atom } from "jotai";

type ThemeMode = "dark" | "light";

// Default to dark mode to match the current UI
export const themeModeAtom = atom<ThemeMode>("dark"); 