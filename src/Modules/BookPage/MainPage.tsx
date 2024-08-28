import { useEffect, useState } from "react";
import { readEpub, preprocessEpub, HtmlObject } from "./preprocessEpub";
import JSZip from "jszip";
import Chapters from "./Chapters";
import RightHand from "./RightHand";
import Text from "./Text";
import { load } from "cheerio";
import { extractToc } from "./extractToc";

export type HighlightRange = {
    startElementId: string;
    startOffset: number;
    endElementId: string;
    endOffset: number;
    highlightedText: string;
    intermediateElementIds?: string[];
    highlightId: string;
};

export type Note = {
    noteText: string;
    noteId: string;
    noteReference: string;
    noteReferenceIdRanges: HighlightRange;
};

export type Chapter = {
    id: string;
    title: string;
    href: string;
    indentLevel: number;
};

function MainPage() {
    const [bookElements, setBookElements] = useState<(HtmlObject | null)[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleEpubChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const epub = await readEpub(file);
                const preprocessedEpub = preprocessEpub(epub);

                // Extract ToC using preprocessed content
                const zip = await JSZip.loadAsync(file);
                const opfFilePath = await findOpfFilePath(zip);
                if (!opfFilePath) {
                    setError("Failed to load opfFilePath.");
                    return;
                }
                const toc = await extractToc(zip, opfFilePath);

                // Convert ToC to chapters data
                const chaptersData = toc.map((item, index) => ({
                    id: item.id, // This is now the correct ID of the element
                    title: item.title,
                    href: item.href,
                    indentLevel: calculateIndentLevel(item.href),
                }));

                setBookElements(preprocessedEpub);
                setChapters(chaptersData);

                console.log("preprocessedEpub", preprocessedEpub);
                console.log("chaptersData", chaptersData);
            } catch (error) {
                console.error("Failed to load EPUB", error);
                setError("Failed to load EPUB. Please try another file.");
            }
        }
    };

    const createNote = (note: Note) => {
        setNotes((oldNotes) => [...oldNotes, note]);
    };

    return (
        <div className="flex min-h-screen flex-row w-full bg-zinc-800 text-gray-300">
            <Chapters chapters={chapters} />
            <Text
                handleEpubChange={handleEpubChange}
                bookElements={bookElements}
                fontSize={24}
                createNote={createNote}
            />
            <RightHand notes={notes} />
        </div>
    );
}

export default MainPage;

function calculateIndentLevel(href: string): number {
    // Simple example: increase indent level based on depth of href structure
    return (href.match(/\//g) || []).length;
}

async function findOpfFilePath(zip: JSZip): Promise<string | null> {
    const containerXml = await zip
        .file("META-INF/container.xml")
        ?.async("string");
    if (containerXml) {
        const $ = load(containerXml, { xmlMode: true });
        const rootfileElement = $("rootfile");
        if (rootfileElement.length > 0) {
            return rootfileElement.attr("full-path") || null;
        }
    }
    return null;
}
