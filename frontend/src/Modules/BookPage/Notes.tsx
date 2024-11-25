import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
    arrowsAtom,
    canvaElementsAtom,
    offsetPositionAtom,
} from "./Konva/konvaAtoms";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";

type Note = {
    endText: string;
    startText: string;
    points: number[];
    arrowId: string;
};

export default function Notes() {
    const [arrows] = useAtom(arrowsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const validArrows = arrows.filter(
            (arrow) => arrow.startId !== null && arrow.endId !== null
        );

        const getElementContent = (element: any, type: string) => {
            if (!element) return "Unknown Element";

            // If type is "text" but there's no text, treat it as "element"
            if (type === "text" && !element.text) {
                type = "element";
            }

            switch (type) {
                case "bookText":
                    // Always display book text
                    return element.text || "Book Text";
                case "text":
                    return element.text;
                case "element":
                default:
                    return element.name || "Element";
            }
        };

        const mappedNotes = validArrows.map((arrow) => {
            const startElement = canvasElements.find(
                (element) => element.id === arrow.startId
            );
            const endElement = canvasElements.find(
                (element) => element.id === arrow.endId
            );

            const startText = getElementContent(startElement, arrow.startType);
            const endText = getElementContent(endElement, arrow.endType);

            return {
                startText,
                endText,
                points: arrow.points,
                arrowId: arrow.id,
            };
        });

        setNotes(mappedNotes);
    }, [arrows, canvasElements]);

    const easeInOutCubic = (t: number) => {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const smoothScroll = (
        targetX: number,
        targetY: number,
        duration: number
    ) => {
        const start = performance.now();
        const initialOffset = { ...offsetPosition };
        const deltaX = targetX - initialOffset.x;
        const deltaY = targetY - initialOffset.y;

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);

            setOffsetPosition({
                x: initialOffset.x + deltaX * easeProgress,
                y: initialOffset.y + deltaY * easeProgress,
            });

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const handleNoteClick = (note: Note) => {
        if (note.points && note.points.length >= 2) {
            const targetY = -note.points[1];
            smoothScroll(-note.points[0] + 500, targetY + 300, 500);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            {notes.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <Card
                                key={note.arrowId}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleNoteClick(note)}
                            >
                                <CardHeader className="flex items-center space-x-2">
                                    {/* Start Type Icon */}
                                    <span className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                        {note.startText === "Book Text" ? "B" : "S"}
                                    </span>
                                    <CardTitle className="text-md font-medium text-gray-800">
                                        {note.startText}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center space-x-2">
                                    {/* End Type Icon */}
                                    <span className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                                        {note.endText === "Book Text" ? "B" : "E"}
                                    </span>
                                    <p className="text-gray-600">
                                        {note.endText}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            ) : (
                <div className="text-sm text-gray-500">No notes available.</div>
            )}
        </div>
    );
}
