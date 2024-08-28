import React, { useEffect, useState } from "react";
import {
    ParagraphObject,
    HeadingObject,
    HtmlObject,
    HighlightRange,
    HtmlElementObject,
} from "../../preprocess/epub/preprocessEpub";
import { useAtom } from "jotai";
import { highlightedRangeAtom } from "../../atoms";
import { v4 as uuidv4 } from "uuid";
import NoteCretor from "./NoteCreator";
import { Note } from "./MainPage";
import { HtmlElement } from "./TextComponents";

type TextProps = {
    bookElements: (HtmlObject | null)[];
    fontSize: number;
    handleEpubChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void>;
    createNote: (note: Note) => void;
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
    createNote,
}: TextProps) {
    const [highlightedRanges, setHighlightedRanges] =
        useAtom(highlightedRangeAtom);

    const [noteCreator, setNoteCreator] = useState<JSX.Element | false>(false);

    const addNoteCreator = (highlight: HighlightRange) => {
        setNoteCreator(
            <NoteCretor
                createNote={createNote}
                highlight={highlight}
                setNoteCreator={setNoteCreator}
            />
        );
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
                highlightId: uuidv4(),
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
            addNoteCreator(newHighlight);
        }
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [highlightedRanges]);
    useEffect(() => {
        console.log(highlightedRanges);
    }, [highlightedRanges]);
    return (
        <div className="w-full  flex flex-col items-center relative h-screen overflow-y-scroll custom-scrollbar">
            {noteCreator}

            <div className="w-600px break-words text-2xl font-serif ">
                {bookElements.map((element, index) => {
                    if (!element) return null;
                    return (
                        <React.Fragment key={`fragment-${index}`}>
                            {element.elements.map((childElement) => (
                                <HtmlElement
                                    element={childElement}
                                    key={childElement.id}
                                    highlights={highlightedRanges}
                                />
                            ))}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
