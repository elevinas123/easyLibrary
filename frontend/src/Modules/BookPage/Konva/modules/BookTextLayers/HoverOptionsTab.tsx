import { useAtom, useSetAtom } from "jotai";
import { useState, useEffect } from "react";
import { FiEdit, FiMessageCircle, FiSave, FiTrash2, FiX, FiCopy } from "react-icons/fi"; // Added FiCopy
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card"; // Import Card for styling
import { Textarea } from "../../../../../components/ui/textarea"; // Import Textarea from shadcn
import {
    arrowsAtom,
    bookIdAtom,
    canvaElementsAtom,
    currentHighlightAtom,
    highlightsAtom,
    hoveredItemsAtom,
} from "../../konvaAtoms";
import createArrow from "../../shapes/Arrow/CreateArrow";
import CreateText from "../../shapes/Text/CreateText";
import { useToast } from "../../../../../hooks/use-toast";
type HoverOptionsTabProps = {};

export default function HoverOptionsTab({}: HoverOptionsTabProps) {
    const [currentHighlight, setCurrentHighlight] =
        useAtom(currentHighlightAtom);
    const [highlights] = useAtom(highlightsAtom);
    const setHighlights = useSetAtom(highlightsAtom);
    const setHoveredItems = useSetAtom(hoveredItemsAtom);
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrowElements, setArrowElements] = useAtom(arrowsAtom);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [bookId] = useAtom(bookIdAtom);
    const [currentHighlightText, setCurrentHighlightText] = useState("");
    const { toast } = useToast();
    // Get the highlighted text when currentHighlight changes
    useEffect(() => {
        if (currentHighlight.id) {
            const highlight = highlights.find(h => h.id === currentHighlight.id);
            if (highlight?.highlightedText) {
                setCurrentHighlightText(highlight.highlightedText);
            }
        }
    }, [currentHighlight, highlights]);
    
    const deleteHighlight = () => {
        setHighlights((highlights) =>
            highlights.filter(
                (highlight) => highlight.id !== currentHighlight.id
            )
        );
        setHoveredItems([]);

        setCurrentHighlight({
            id: undefined,
            editing: false,
            creating: false,
            mousePosition: { x: 0, y: 0 },
            offsetPosition: { x: 0, y: 0 },
        });
    };

    
    const addComment = () => {
        setIsAddingNote(true);
    };

    const handleSaveNote = () => {
        if (noteText.trim() === "") {
            // Optionally, you can add validation or error handling here
            return;
        }
        if (!bookId) return;

        console.log("Save Note", noteText);
        const textX = currentHighlight.mousePosition.x + 200;
        const textY = currentHighlight.mousePosition.y + 10;
        const newNoteText = CreateText({
            x: textX,
            y: textY,
            bookId: bookId,
            text: noteText,
            fill: "black",
            strokeColor: "white",
        });
        const newNoteArrow = createArrow({
            points: [
                {
                    x: currentHighlight.mousePosition.x,
                    y: currentHighlight.mousePosition.y,
                },
                { x: textX, y: textY },
            ],
            bookId,
            startId: currentHighlight.id,
            endId: newNoteText.id,
            startType: "bookText",
            endType: "text",
        });
        setCanvaElements([...canvaElements, newNoteText]);
        setArrowElements([...arrowElements, newNoteArrow]);
        // Reset the state
        setNoteText("");
        setIsAddingNote(false);
        setCurrentHighlight({
            ...currentHighlight,
            editing: false,
        });
    };

    const handleCancelNote = () => {
        setNoteText("");
        setIsAddingNote(false);
    };

    const copyHighlightedText = () => {
        if (currentHighlightText) {
            navigator.clipboard.writeText(currentHighlightText)
                .then(() => {
                    // Show success message if you have a toast component
                    toast?.({
                        title: "Text copied",
                        description: "Highlighted text copied to clipboard",
                    });
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        }
    };

    return (
        <div className="absolute z-50">
            {!currentHighlight.creating && currentHighlight.editing ? (
                <Card
                    style={{
                        position: "absolute",
                        top: currentHighlight.offsetPosition.y,
                        left: currentHighlight.offsetPosition.x,
                    }}
                    className="w-64"
                >
                    <div className="divide-y divide-gray-200">
                        {currentHighlightText && (
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Highlighted Text:</p>
                                <p className="text-sm text-gray-600 italic mb-2 line-clamp-3">{currentHighlightText}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyHighlightedText}
                                    className="flex items-center gap-1 text-xs"
                                >
                                    <FiCopy className="h-3 w-3" /> Copy Text
                                </Button>
                            </div>
                        )}
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
