// Notes.tsx

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StartType } from "../../endPointTypes/types";
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
    startId: string | null;
    endId: string | null;
    startType: StartType;
    endType: StartType;
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
        const mappedNotes = validArrows.map((arrow) => {
            let startText: string = "";
            let endText: string = "";
            let elements = canvasElements.filter(
                (element) => element.type === "text"
            );
            if (arrow.startType === "text") {
                startText =
                    elements.find((element) => element.id === arrow.startId)
                        ?.text || "";
            }
            if (arrow.endType === "text") {
                endText =
                    elements.find((element) => element.id === arrow.endId)
                        ?.text || "";
            }
            return {
                endText,
                startText,
                points: arrow.points,
                arrowId: arrow.id,
                startId: arrow.startId,
                endId: arrow.endId,
                startType: arrow.startType,
                endType: arrow.endType,
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
        // Implement navigation to the note's position
        if (note.points && note.points.length >= 2) {
            const targetY = -note.points[1]; // Assuming Y coordinate is at index 1
            smoothScroll(-note.points[0] + 500, targetY + 300, 500);
        }
    };

    const handleDeleteNote = (noteId: string) => {
        // Implement note deletion logic
        // You might need to update the arrowsAtom to remove the arrow
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
                                className="cursor-pointer"
                                onClick={() => handleNoteClick(note)}
                            >
                                <CardHeader className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-sm text-gray-500">
                                            Reference:{" "}
                                            <span className="italic text-gray-700">
                                                {note.startText}
                                            </span>
                                        </CardTitle>
                                    </div>
                                    
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-800">
                                        {note.endText}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            ) : (
                <div className="text-gray-500">No notes available.</div>
            )}
        </div>
    );
}
