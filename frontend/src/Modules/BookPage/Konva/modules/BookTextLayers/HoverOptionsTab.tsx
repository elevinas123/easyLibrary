import React, { useState } from "react";
import { useAtom } from "jotai";
import {
    arrowsAtom,
    canvaElementsAtom,
    currentHighlightAtom,
    highlightOptionsAtom,
    highlightsAtom,
    hoveredItemsAtom,
} from "../../konvaAtoms";
import { Button } from "../../../../../components/ui/button";
import { FiEdit, FiTrash2, FiMessageCircle, FiSave, FiX } from "react-icons/fi"; // Added FiSave and FiX for new actions
import { Textarea } from "../../../../../components/ui/textarea"; // Import Textarea from shadcn
import { Card } from "../../../../../components/ui/card"; // Import Card for styling
import CreateText from "../../shapes/Text/CreateText";
import createArrow from "../../shapes/Arrow/CreateArrow";

type HoverOptionsTabProps = {};

export default function HoverOptionsTab({}: HoverOptionsTabProps) {
    const [highlightOptions, setHighlightOptions] =
        useAtom(highlightOptionsAtom);
    const [currentHighlight, setCurrentHighlight] =
        useAtom(currentHighlightAtom);
    const [highlights, setHighlights] = useAtom(highlightsAtom);
    const [hoveredItems, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrowElements, setArrowElements] = useAtom(arrowsAtom);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [noteText, setNoteText] = useState("");

    const deleteHighlight = () => {
        setHighlights((highlights) =>
            highlights.filter(
                (highlight) => highlight.id !== highlightOptions.highlightId
            )
        );
        setHoveredItems([]);
        setHighlightOptions({
            active: false,
            highlightId: null,
            mousePosition: { x: 0, y: 0 },
        });
        setCurrentHighlight({
            id: null,
            editing: false,
            creating: false,
        });
    };

    const editHighlight = () => {
        console.log("Edit Highlight");
        // Add edit logic here
    };

    const addComment = () => {
        setIsAddingNote(true);
    };

    const handleSaveNote = () => {
        if (noteText.trim() === "") {
            // Optionally, you can add validation or error handling here
            return;
        }

        console.log("Save Note", noteText);
        const textX = highlightOptions.mousePosition.x + 200;
        const textY = highlightOptions.mousePosition.y + 10;
        const newNoteText = CreateText({
            x: textX,
            y: textY,
            text: noteText,
            fill: "white",
            strokeColor: "white",
        });
        const newNoteArrow = createArrow({
            points: [
                highlightOptions.mousePosition.x,
                highlightOptions.mousePosition.y,
                textX,
                textY,
            ],
            startId: highlightOptions.highlightId,
            endId: newNoteText.id,
            startType: "bookText",
            endType: "text",
        });
        setCanvaElements([...canvaElements, newNoteText]);
        setArrowElements([...arrowElements, newNoteArrow]);
        // Reset the state
        setNoteText("");
        setIsAddingNote(false);
        setHighlightOptions({
            ...highlightOptions,
            active: false,
        });
    };

    const handleCancelNote = () => {
        setNoteText("");
        setIsAddingNote(false);
    };

    return (
        <div className="absolute z-50">
            {highlightOptions.active && !currentHighlight.creating ? (
                <Card
                    style={{
                        position: "absolute",
                        top: highlightOptions.mousePosition.y,
                        left: highlightOptions.mousePosition.x,
                    }}
                    className="w-64"
                >
                    <div className="divide-y divide-gray-200">
                        <div
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={editHighlight}
                        >
                            <FiEdit className="text-gray-500" />
                            <span>Edit Highlight</span>
                        </div>
                        {!isAddingNote && (
                            <div
                                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                onClick={addComment}
                            >
                                <FiMessageCircle className="text-gray-500" />
                                <span>Add Note</span>
                            </div>
                        )}
                        {isAddingNote && (
                            <div className="p-3">
                                <Textarea
                                    value={noteText}
                                    onChange={(e) =>
                                        setNoteText(e.target.value)
                                    }
                                    placeholder="Enter your note..."
                                    className="mb-2"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleCancelNote}
                                        className="flex items-center gap-1"
                                    >
                                        <FiX /> Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleSaveNote}
                                        className="flex items-center gap-1"
                                    >
                                        <FiSave /> Save
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-100 cursor-pointer text-red-600"
                            onClick={deleteHighlight}
                        >
                            <FiTrash2 className="text-red-600" />
                            <span>Delete</span>
                        </div>
                    </div>
                </Card>
            ) : null}
        </div>
    );
}
