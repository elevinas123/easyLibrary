import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";
export const preprocessText = (
    text: string,
    maxCharsPerLine: number
) => {
    const removedWhiteSpace = removeExtraWhitespace(text);
    const words = removedWhiteSpace.split(" ");
    console.log("words", words)
    let columns = [];
    let currentColumn = "";

    words.forEach((word) => {
        // Check if adding the next word would exceed the maxCharsPerLine limit
        if (currentColumn.length + word.length + 1 > maxCharsPerLine) {
            // Save the current column and start a new one
            columns.push(currentColumn);
            currentColumn = word; // Start new column with the current word
        } else {
            // Append word to the current column
            if (currentColumn.length > 0) {
                currentColumn += " "; // Add a space before appending the word
            }
            currentColumn += word;
        }
    });

    // Push the last column if it's not empty
    if (currentColumn.length > 0) {
        columns.push(currentColumn);
    }
    console.log("columns", columns);
    return columns;
};

export const removeExtraWhitespace = (text: string) => {
    // Replace multiple spaces, tabs, and newlines with a single space
    return text
        .replace(/\s+/g, " ") // Replace all whitespace with single space
        .replace(/\s([?.!,;:])/g, "$1") // Remove space before punctuation
        .replace(/([?.!,;:])\s(?=[?.!,;:])/g, "$1") // Remove space between punctuation
        .trim();
};
