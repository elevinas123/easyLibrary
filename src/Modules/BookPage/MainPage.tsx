import { useEffect, useState } from "react";
import { readEpub } from "../../preprocess/epub/readEpub";
import Chapters from "./Chapters";
import RightHand from "./RightHand";
import Text from "./Text";
import { HtmlObject, preprocessEpub, HighlightRange } from "./preprocessEpub";

export type Note = {
    noteText: string;
    noteId: string;
    noteReference: string;
    noteReferenceIdRanges: HighlightRange;
};
export type Chapter = {
    id: string;
    title: string;
    tagName: string;
    indentLevel: number;
};

function MainPage() {
    const [bookElements, setBookElements] = useState<(HtmlObject | null)[]>([]);
    const [_, setError] = useState<string | null>(null);
    const [fontSize] = useState(24);
    const [notes, setNotes] = useState<Note[]>([]);
    const [chapters, setChapters] = useState < Chapter[]>([]);
    const createNote = (note: Note) => {
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

    useEffect(() => {
        const viablePages = bookElements.filter((page) => page !== null);
        const allHeadings = viablePages.flatMap((page) => {
            const headings = page.elements.filter(
                (element) => element.type === "heading"
            );
            return headings;
        });

        // Calculate the indentation levels based on the tagName (e.g., h1, h2, h3)
        const tagHierarchy = new Map<string, number>();
        let currentIndentLevel = 0;

        allHeadings.forEach((heading) => {
            const { tagName } = heading;
            if (!tagHierarchy.has(tagName)) {
                tagHierarchy.set(tagName, currentIndentLevel++);
            }
        });

        const chaptersData = allHeadings.map((heading) => ({
            id: heading.id,
            title: heading.text,
            tagName: heading.tagName,
            indentLevel: tagHierarchy.get(heading.tagName) || 0,
        }));

        setChapters(chaptersData);
        console.log("allHeadings", allHeadings);
        console.log("chaptersData", chaptersData);
    }, [bookElements]);

    return (
        <div className="flex min-h-screen flex-row w-full bg-zinc-800 text-gray-300">
            <Chapters chapters={chapters} />
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
