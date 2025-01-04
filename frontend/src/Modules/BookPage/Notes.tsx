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
    CardDescription,
} from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Point } from "../../endPointTypes/types";

type Note = {
    endText: string;
    startText: string;
    points: Point[];
    arrowId: string;
    startType: string;
    endType: string;
};

export default function Notes() {
    const [arrows] = useAtom(arrowsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const validArrows = arrows.filter(
            (arrow) =>
                arrow.arrowElement.startId !== undefined &&
                arrow.arrowElement.endId !== undefined
        );

        const mappedNotes = validArrows.map((arrow) => {
            if (!arrow.arrowElement.startType || !arrow.arrowElement.endType) {
                throw new Error("Arrow does not have a start or end element");
            }
            const startElement = canvasElements.find(
                (element) => element.id === arrow.arrowElement.startId
            );
            const endElement = canvasElements.find(
                (element) => element.id === arrow.arrowElement.endId
            );
            console.log("startElement", startElement);
            console.log("endElement", endElement);
            const startText = getElementContent(
                startElement,
                arrow.arrowElement.startType
            );
            const endText = getElementContent(
                endElement,
                arrow.arrowElement.endType
            );

            return {
                startText,
                endText,
                points: arrow.points,
                arrowId: arrow.id,
                startType: arrow.arrowElement.startType,
                endType: arrow.arrowElement.endType,
            };
        });

        setNotes(mappedNotes);
    }, [arrows, canvasElements]);

    const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

    // Helper function to get content from elements
    function getElementContent(element: any, type: string): string {
        if (!element) return "Unknown";
        if (type === "BookText") {
            return element.text || "Book Text";
        } else if (type === "StickyNote") {
            return element.content || "Sticky Note";
        } else if (type === "Image") {
            return "Image";
        }
        return "Unknown";
    }

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
                                <CardHeader>
                                    <CardTitle className="text-md font-medium text-gray-800">
                                        {note.startType} → {note.endType}
                                    </CardTitle>
                                    <CardDescription>
                                        Click to navigate to the note
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-2">
                                        <div>
                                            <span className="font-semibold">
                                                From:
                                            </span>{" "}
                                            {note.startText}
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                To:
                                            </span>{" "}
                                            {note.endText}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="text-sm text-gray-500">No notes available.</div>
            )}
        </div>
    );
}
