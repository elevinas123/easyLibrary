import { useMutation } from "@tanstack/react-query";
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
import { FiPlus } from "react-icons/fi";
import { useRef } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom, userAtom } from "../../atoms";

type ImportBookProps = {
    isCollapsed: boolean;
};
const importBook = async ({
    bookElements,
    metaData,
    userId,
    accessToken,
}: {
    bookElements: ProcessedElement[];
    metaData: Partial<Record<string, string>>;
    userId: string;
    accessToken: string;
}): Promise<any> => {
    console.log(bookElements);
    console.log("metaHere", metaData);
    console.log("access_token", accessToken);
    const { data } = await axios.post(
        "/api/book",
        {
            userId: userId,
            title: metaData.title || "No Title",
            description: metaData.description || "No Description",
            author: metaData.author || metaData.creator || "No Author",
            genre: ["Classic", "Fiction"],
            imageUrl: "https://example.com/image.jpg",
            liked: true,
            bookElements: bookElements,
            dateAdded: new Date().toISOString(),
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return data;
};

export default function ImportBook({ isCollapsed }: ImportBookProps) {
    const [_, setError] = useState<string | null>(null);
    const [user] = useAtom(userAtom);
    const [accessToken] = useAtom(accessTokenAtom);
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
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const processBookElements = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) {
            return null;
        }
        const elements = await handleEpubChange(file);
        if (!elements) {
            console.error("Failed to load EPUB");
            return;
        }
        if (!user) {
            console.error("User not found");
            return;
        }
        const processedElements = processElements(
            elements.epubElements,
            24,
            800
        );
        mutation.mutate({
            bookElements: processedElements,
            metaData: elements.metaData,
            userId: user._id,
            accessToken: accessToken,
        });
    };

    const handleEpubChange = async (file: File) => {
        try {
            const { paragraphs, metaData } = await readEpub(file);
            const epubElements = preprocessEpub(paragraphs);
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
            return { epubElements, metaData };
        } catch (error) {
            console.error("Failed to load EPUB", error);
            setError("Failed to load EPUB. Please try another file.");
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
        <button
            className="flex items-center p-4 hover:bg-gray-700 transition-colors"
            onClick={handleButtonClick}
        >
            <FiPlus size={24} />
            {!isCollapsed && <span className="ml-2">Add Document</span>}
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept=".epub"
                onChange={processBookElements}
            />
        </button>
    );
}
