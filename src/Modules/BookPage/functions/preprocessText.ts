import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";

export const preprocessText = (text: string): ExcalidrawElementSkeleton[] => {
    const removedWhiteSpace = removeExtraWhitespace(text)
    console.log("removedWhiteSpace", removedWhiteSpace);
    return [];
};

export const removeExtraWhitespace = (text: string) => {
    // Replace multiple spaces, tabs, and newlines with a single space
    return text.replace(/\s+/g, " ").trim();
};
