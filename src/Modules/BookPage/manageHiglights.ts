import { HighlightRange } from "./MainPage";

export const mergeHighlights = (
    highlights: HighlightRange[]
): HighlightRange[] => {
    if (highlights.length === 0) return [];

    // Sort highlights by start element and start offset
    highlights.sort((a, b) => {
        if (a.startElementId === b.startElementId) {
            return a.startOffset - b.startOffset;
        }
        return a.startElementId.localeCompare(b.startElementId);
    });

    const mergedHighlights: HighlightRange[] = [];
    let current = highlights[0];

    for (let i = 1; i < highlights.length; i++) {
        const next = highlights[i];

        // Check if current and next highlight overlap or are adjacent
        const currentEndInSameElement =
            current.endElementId === next.startElementId &&
            current.endOffset >= next.startOffset - 1;
        const spansMultipleElements =
            current.endElementId !== next.startElementId &&
            current.intermediateElementIds?.includes(next.startElementId);

        if (currentEndInSameElement || spansMultipleElements) {
            // Merge the two highlights
            current.endElementId = next.endElementId;
            current.endOffset = next.endOffset;
            current.intermediateElementIds = [
                ...new Set([
                    ...current.intermediateElementIds,
                    ...next.intermediateElementIds,
                    next.startElementId, // Include the start element of the next highlight
                ]),
            ];
        } else {
            // Push the current highlight and move to the next
            mergedHighlights.push(current);
            current = next;
        }
    }

    // Don't forget to push the last merged highlight
    mergedHighlights.push(current);

    return mergedHighlights;
};
