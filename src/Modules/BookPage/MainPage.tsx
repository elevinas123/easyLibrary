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

    const createNotes = (ranges: HighlightRange[]) => {
        setNotes(
            ranges.map((range, index) => ({
                noteText: `Note ${index + 1}`,
                noteId: `${index + 1}`,
                noteReference: "Reference text", // This should be dynamic based on actual highlighted text
                noteReferenceIdRanges: range,
            }))
        );
    };

    useEffect(() => {
        console.log("notes", highlightedRanges)
        createNotes(highlightedRanges);
    }, [highlightedRanges]);

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
            />
            <RightHand notes={notes} />
        </div>
    );
}

export default MainPage;
