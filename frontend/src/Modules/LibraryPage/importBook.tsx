import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { load } from "cheerio";
import { useAtom } from "jotai";
import JSZip from "jszip";
import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { accessTokenAtom, userAtom } from "../../atoms";
import { useToast } from "../../hooks/use-toast";
import { extractToc } from "../../preprocess/epub/extractToc";
import { processElements } from "../../preprocess/epub/htmlToBookElements";
import { preprocessEpub, readEpub } from "../../preprocess/epub/preprocessEpub";
import { apiFetch } from "../../endPointTypes/apiClient";
import { ProcessedElement } from "../../endPointTypes/types";

type ImportBookProps = {
    isCollapsed: boolean;
    setBooksLoading: React.Dispatch<React.SetStateAction<string[]>>;
};
const importBook = async ({
    bookElements,
    metaData,
    userId,
    accessToken,
    coverImage,
    setBooksLoading,
}: {
    bookElements: ProcessedElement[];
    metaData: Partial<Record<string, string>>;
    userId: string;
    accessToken: string | null;
    coverImage: Blob | null;
    chaptersData: {
        id: string;
        title: string;
        href: string | undefined;
        indentLevel: number | null;
    }[];
    setBooksLoading: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    setBooksLoading((prev) => [...prev, "hi"]);

    console.log(bookElements);
    console.log("metaHere", metaData);
    console.log("access_token", accessToken);
    let url: string = "https://example.com/image.jpg";
    if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);
        formData.append("upload_preset", "rkarvkvu"); // Correct field for the unsigned preset

        const { data } = await axios.post(
            "https://api.cloudinary.com/v1_1/dxgc5hsrr/image/upload",
            formData
        );
        url = data.secure_url;
        console.log("data", data);
    }
    const dataSending = {
        userId: userId,
        title: metaData["dc:title"] || "No Title",
        description: metaData.description || "No Description",
        author: metaData.author || metaData["dc:creator"] || "No Author",
        genre: ["Classic", "Fiction"],
        imageUrl: url,
        liked: true,
        bookElements: bookElements,
        dateAdded: new Date().toISOString(),
        canvaElements: [],
        curveElements: [],
        highlights: [],
        offsetPosition: { x: 0, y: 0 },
        scale: 1,
    };
    const data = await apiFetch(
        "POST /book",
        { body: dataSending },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return data;
};

export default function ImportBook({
    isCollapsed,
    setBooksLoading,
}: ImportBookProps) {
    const [_, setError] = useState<string | null>(null);
    const [user] = useAtom(userAtom);
    const [accessToken] = useAtom(accessTokenAtom);
    const { toast } = useToast();
    // Use the mutation with the correct types
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: importBook, // Pass the function directly
        onSuccess: (data) => {
            console.log("Book imported successfully:", data);
            queryClient.invalidateQueries({ queryKey: ["book"] });
            toast({
                title: "Book imported successfully",
                duration: 5000,
            });
        },
        onError: (err) => {
            toast({
                title: "Failed to import book",
                duration: 5000,
            });
            console.error("Failed to import book:", err);
        },
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
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
            chaptersData: elements.chaptersData,
            coverImage: elements.coverImage,
            setBooksLoading,
        });
    };

    const handleEpubChange = async (file: File) => {
        try {
            const { paragraphs, metaData, coverImage } = await readEpub(file);
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
            return { epubElements, metaData, coverImage, chaptersData };
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
