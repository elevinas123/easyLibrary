import { useEffect, useState } from "react";
import { readEpub } from "../../preprocess/epub/readEpub";
import Chapters from "./Chapters";
import RightHand from "./RightHand";
import Text from "./Text";
import { HtmlObject, preprocessEpub } from "./preprocessEpub";
import { useAtom } from "jotai";
import { highlightedRangeAtom } from "../../atoms";
export type HighlightRange = {
    startId: string;
    endId: string;
};
export type Note = {
    noteText: string;
    noteId: string;
    noteReference: string;
    noteReferenceIdRanges: HighlightRange;
};

function MainPage() {
    const [bookElements, setBookElements] = useState<(HtmlObject | null)[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState(24);
    const [highlightedRanges, setHighlightedRanges] =
        useAtom(highlightedRangeAtom);
    const [notes, setNotes] = useState<Note[]>([])
    const createNotes = (ranges: HighlightRange[]) =>{
        setNotes(
                ranges.map(range => {
                    return {noteText: "testas1", noteId: "1", noteReference: "text", noteReferenceIdRanges: {startId: "asd", endId: "as"}}
                })
        )
    }
    useEffect(() => {
        createNotes(highlightedRanges)
    }, [highlightedRanges])
    
    const handleEpubChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const epub = await readEpub(file);
                const preprocessedEpub = preprocessEpub(epub);
                setBookElements(preprocessedEpub);
            } catch (error) {
                console.log("error", error);
                setError("Failed to load EPUB. Please try another file.");
            }
        }
    };

    return (
        <div className="flex  min-h-screen flex-row w-full bg-zinc-800 text-gray-300">
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
