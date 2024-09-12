import { useAtom } from "jotai";
import { arrowsAtom, textItemsAtom } from "./Konva/konvaAtoms";
import { useEffect, useState } from "react";
import { StartType } from "./Konva/modules/NotesLayer/MainNotesLayer";


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
    const [textItems] = useAtom(textItemsAtom);
    const [notes, setNotes] = useState<Note[]>([]);
    useEffect(() => {
        const validArrows = arrows.filter(
            (arrow) =>
                arrow.startType === "userText" && arrow.endType === "userText"
        );
        const mappedArrows = validArrows.map((arrow) => {
            const startText = textItems.filter(
                (text) => text.id === arrow.startId
            );
            const endText = textItems.filter((text) => text.id === arrow.endId);
            if (!startText || startText.length < 1) return false;
            if (!endText || endText.length < 1) return false;
            return {
                ...arrow,
                endText: endText[0].text,
                startText: startText[0].text
            }
        });
        setNotes(mappedArrows.filter((arrow) => arrow !== false));
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
                                <span className="italic">
                                    {note.startText}
                                </span>
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
