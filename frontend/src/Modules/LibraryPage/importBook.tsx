import {
    useMutation
} from "@tanstack/react-query";
import axios from "axios";
import { load } from "cheerio";
import JSZip from "jszip";
import { useState } from "react";
import { extractToc } from "../../preprocess/epub/extractToc";
import {
    ProcessedElement,
    processElements,
} from "../../preprocess/epub/htmlToBookElements";
import { preprocessEpub, readEpub } from "../../preprocess/epub/preprocessEpub";

type ImportBookProps = {
    // Define your prop types here
};

const importBook = async (bookElements: ProcessedElement[]): Promise<any> => {
    console.log(bookElements)
    const { data } = await axios.post("/api/book", {
        userId: "12345",
        title: "The Great Gatsby",
        description: "A novel written by American author F. Scott Fitzgerald.",
        author: "F. Scott Fitzgerald",
        genre: ["Classic", "Fiction"],
        imageUrl: "https://example.com/image.jpg",
        liked: true,
        bookElements: bookElements,
        dateAdded: "2023-10-01T00:00:00.000Z",
        __v: 0,
    });
    return data;
};

export default function ImportBook({ }: ImportBookProps) {
    const [_, setError] = useState<string | null>(null);
    // Use the mutation with the correct types
    const mutation = useMutation({
        mutationFn: importBook, // Pass the function directly
        onSuccess: (data) => {
            console.log("Book imported successfully:", data);
        },
        onError: (err) => {
            console.error("Failed to import book:", err);
        },
    });

    const processBookElements = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const epubElements = await handleEpubChange(event);
        if (!epubElements) {
            return;
        }
        const processedElements = processElements(epubElements, 24, 800);
        mutation.mutate(processedElements);
    };

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
                const chaptersData = toc.map((item) => ({
                    id: item.id, // This is now the correct ID of the element
                    title: item.title,
                    href: item.href,
                    indentLevel: calculateIndentLevel(item.href),
                }));
                return preprocessedEpub;
            } catch (error) {
                console.error("Failed to load EPUB", error);
                setError("Failed to load EPUB. Please try another file.");
            }
        }
    };
    function calculateIndentLevel(href: string | undefined) {
        if (!href) return null;
        // Simple example: increase indent level based on depth of href structure
        return (href.match(/\//g) || []).length;
    }

    async function findOpfFilePath(zip: JSZip) {
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
    return (
        <div>
            <input
                className="absolute left-1/2 z-10 bg-gray-500"
                type="file"
                placeholder="Select EPUB"
                accept=".epub"
                onChange={processBookElements}
            />
        </div>
    );
}
