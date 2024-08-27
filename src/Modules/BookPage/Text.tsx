import React, { useEffect } from "react";
import { ParagraphObject, HeadingObject, HtmlObject, HighlightRange } from "./preprocessEpub";
import { useAtom } from "jotai";
import { highlightedRangeAtom } from "../../atoms";
import { Paragraph } from "./TextComponents";

type TextProps = {
    bookElements: (HtmlObject | null)[];
    fontSize: number;
    handleEpubChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void>;
};

const mergeHighlights = (highlights: HighlightRange[]): HighlightRange[] => {
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




export default function Text({
    bookElements,
    fontSize,
    handleEpubChange,
}: TextProps) {
    const [highlightedRanges, setHighlightedRanges] =
        useAtom(highlightedRangeAtom);

    const renderContent = (
        element: ParagraphObject | HeadingObject,
        index: number
    ) => {
        if (element.type === "paragraph") {
            return (
                <Paragraph
                    key={`paragraph-${index}`}
                    id={element.id}
                    text={element.text}
                    highlights={highlightedRanges}
                    style={element.style}
                />
            );
        } else if (element.type === "heading") {
            const HeadingTag = element.tagName as keyof JSX.IntrinsicElements;
            return (
                <HeadingTag
                    key={`heading-${index}`}
                    data-id={element.id}
                    style={{ ...element.style, fontSize: `${fontSize}px` }}
                >
                    {element.text}
                </HeadingTag>
            );
        }

        return null;
    };

    const handleMouseUp = () => {
        console.log("handleMouseUp triggered");
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer;
            const endContainer = range.endContainer;
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            // Find the nearest parent element with a data-id
            const startElement =
                startContainer.parentElement?.closest("[data-id]");
            const endElement = endContainer.parentElement?.closest("[data-id]");

            if (!startElement || !endElement) {
                console.warn(
                    "Selection does not fall within identifiable elements."
                );
                return;
            }

            const startElementId = startElement.getAttribute("data-id");
            const endElementId = endElement.getAttribute("data-id");

            const intermediateElementIds = [];
            if (startElementId !== endElementId) {
                let currentNode = startElement.nextSibling;
                while (currentNode && currentNode !== endElement) {
                    if (currentNode.nodeType === Node.ELEMENT_NODE) {
                        const elementId = currentNode.getAttribute("data-id");
                        if (elementId) {
                            intermediateElementIds.push(elementId);
                        }
                    }
                    currentNode = currentNode.nextSibling;
                }
            }

            const newHighlight = {
                startElementId,
                startOffset,
                endElementId,
                endOffset,
                highlightedText: selection.toString(),
                intermediateElementIds,
            };

            // Update state with merged highlight ranges
            setHighlightedRanges((prevRanges) =>
                mergeHighlights([...prevRanges, newHighlight])
            );

            // Log the selection details
            console.log("Selection details:", {
                selectionText: selection.toString(),
                startElementId,
                startOffset,
                endElementId,
                endOffset,
                intermediateElementIds,
            });
        }
    };



    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [highlightedRanges]);

    return (
        <div className="w-full flex flex-col items-center">
            <input
                type="file"
                placeholder="Select EPUB"
                accept=".epub"
                onChange={handleEpubChange}
            />
            <div
                className="w-96"
                style={{ overflow: "hidden", maxWidth: "100%" }}
            >
                {bookElements.map((element, index) => {
                    if (!element) return null;
                    return (
                        <React.Fragment key={`fragment-${index}`}>
                            {element.elements.map((childElement, childIndex) =>
                                renderContent(childElement, childIndex)
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
