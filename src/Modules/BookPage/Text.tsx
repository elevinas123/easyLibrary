import React, { useEffect, useState } from "react";
import {
    HtmlObject,
    HighlightRange,
} from "../../preprocess/epub/preprocessEpub";
import { useAtom } from "jotai";
import { highlightedRangeAtom } from "../../atoms";
import { v4 as uuidv4 } from "uuid";
import NoteCretor from "./NoteCreator";
import { Note } from "./MainPage";
import { HtmlElement } from "./TextComponents";
import { mergeHighlights } from "./manageHiglights";
import { Stage } from "react-konva";
import KonvaStage from "../Konva/KonvaStage";

type TextProps = {
    bookElements: (HtmlObject | null)[];
    fontSize: number;

    createNote: (note: Note) => void;
};

export default function Text({ bookElements, createNote }: TextProps) {
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
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer;
            const endContainer = range.endContainer;
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

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
            if (!startElementId || !endElementId) {
                return;
            }

            const newHighlight: HighlightRange = {
                startElementId,
                startOffset,
                endElementId,
                endOffset,
                highlightedText: selection.toString(),
                intermediateElementIds,
                highlightId: uuidv4(),
            };

            setHighlightedRanges((prevRanges) =>
                mergeHighlights([...prevRanges, newHighlight])
            );

            addNoteCreator(newHighlight);
        }
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [highlightedRanges]);

    return (
        <div className="w-full flex flex-col items-center relative h-screen overflow-y-scroll custom-scrollbar">
            {noteCreator}

            <div className=" flex-grow break-words text-2xl font-serif ">
                <KonvaStage />
            </div>
        </div>
    );
}
