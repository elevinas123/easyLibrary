import { useAtom } from "jotai";
import {
    arrowsAtom,
    canvaElementsAtom,
    highlightsAtom,
} from "./Konva/konvaAtoms";
import { useEffect, useState } from "react";
import { StartType } from "./Konva/KonvaStage";

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
    const [highlights] = useAtom(highlightsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [notes, setNotes] = useState<Note[]>([]);
    useEffect(() => {
        const validArrows = arrows.filter(
            (arrow) => arrow.startId !== null && arrow.endId !== null
        );
        const mappedNotes = validArrows.map((arrow) => {
            let startText: undefined | string = "";
            let endText: undefined | string = "";
            let elements = canvasElements.filter(
                (element) => element.type === "text"
            );
            if (arrow.startType === "text") {
                startText = elements.find(
                    (element) => element.id === arrow.startId
                )?.text;
            }
            if (arrow.endType === "text") {
                endText = elements.find(
                    (element) => element.id === arrow.endId
                )?.text;
            }
            return {
                endText: endText || "",
                startText: startText || "",
                points: arrow.points,
                arrowId: arrow.id,
                startId: arrow.startId,
                endId: arrow.endId,
                startType: arrow.startType,
                endType: arrow.endType,
            };
        });
        setNotes(mappedNotes);
    }, [arrows]);
    return (
        <div className="w-full p-4 bg-zinc-900 rounded-lg text-gray-300">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            {notes.length > 0 ? (
                <ul className="space-y-4">
                    {notes.map((note) => (
                        <li
                            key={note.arrowId}
                            className="border-b border-gray-700 pb-2 cursor-pointer"
                        >
                            <div className="text-gray-400 text-sm">
                                <span className="font-bold">Reference:</span>{" "}
                                <span className="italic">{note.startText}</span>
                            </div>
                            <div className="mt-2 text-gray-300">
                                {note.endText}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-500">No notes available.</div>
            )}
        </div>
    );
}
