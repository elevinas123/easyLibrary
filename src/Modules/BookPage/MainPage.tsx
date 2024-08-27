import { useEffect, useState } from "react";
import { readEpub } from "../../preprocess/epub/readEpub";
import Chapters from "./Chapters";
import RightHand from "./RightHand";
import Text from "./Text";
import { HtmlObject, preprocessEpub, HighlightRange } from "./preprocessEpub";
import { useAtom } from "jotai";
import { highlightedRangeAtom } from "../../atoms";

export type Note = {
    noteText: string;
    noteId: string;
    noteReference: string;
    noteReferenceIdRanges: HighlightRange;
};



function MainPage() {
    const [bookElements, setBookElements] = useState<(HtmlObject | null)[]>([]);
    const [_, setError] = useState<string | null>(null);
    const [fontSize] = useState(24);
    const [highlightedRanges] =
        useAtom(highlightedRangeAtom);
    const [notes, setNotes] = useState<Note[]>([]);

    const createNote = (note) => {
        setNotes((oldNotes) => [...oldNotes, note]);
    };

    const handleEpubChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const epub = await readEpub(file);
                const preprocessedEpub = preprocessEpub(epub);
                console.log("preprocessedEpub", preprocessedEpub);
                setBookElements(preprocessedEpub);
            } catch (error) {
                console.error("Failed to load EPUB", error);
                setError("Failed to load EPUB. Please try another file.");
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-row w-full bg-zinc-800 text-gray-300">
            <Chapters />
            <Text
                handleEpubChange={handleEpubChange}
                bookElements={bookElements}
                fontSize={fontSize}
                createNote={createNote}
            />
            <RightHand notes={notes} />
        </div>
    );
}

export default MainPage;
