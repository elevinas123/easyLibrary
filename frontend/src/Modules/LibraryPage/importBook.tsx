import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { load } from "cheerio";
import JSZip from "jszip";
import { Plus } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/userAuth";
import { extractToc } from "../../preprocess/epub/extractToc";
import {
    ProcessedElement,
    processElements,
} from "../../preprocess/epub/htmlToBookElements";
import { preprocessEpub, readEpub } from "../../preprocess/epub/preprocessEpub";
import { ChaptersData } from "../../endPointTypes/types";
import { v4 as uuidv4 } from "uuid";
import { useAtom } from "jotai";
import { bookIdAtom } from "../BookPage/Konva/konvaAtoms";
import { useSettings } from "../../hooks/useSettings";

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
    chaptersData,
    totalPages,
    setBooksLoading,
}: {
    bookElements: ProcessedElement[];
    metaData: Partial<Record<string, string>>;
    userId: string;
    accessToken: string | undefined;
    coverImage: Blob | null;
    chaptersData: ChaptersData[];
    totalPages: number;
    setBooksLoading: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    setBooksLoading((prev) => [...prev, "hi"]);

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
        userId: userId, // Send userId as a reference
        title: metaData["dc:title"] || "No Title",
        description: metaData.description || "No Description",
        author: metaData.author || metaData["dc:creator"] || "No Author",
        genres: ["Classic", "Fiction"], // Send genres as plain strings
        bookshelves: [],
        imageUrl: url,
        liked: true,
        bookElements, // Pass raw book elements as received
        dateAdded: new Date(),
        highlights: [], // Same as above
        offsetPosition: { x: 0, y: 0 }, // Raw data for offset position
        chaptersData, // Pass raw chaptersData
        scale: 1, // Include the scale as raw data
        totalPages: totalPages, // Make sure this is included
    };
    
    console.log("Sending book with totalPages:", totalPages);
    
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
    const { accessToken, user } = useAuth();
    const { toast } = useToast();
    const [bookId] = useAtom(bookIdAtom);
    const { settings } = useSettings();
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        
        // Calculate total pages
        const totalPages = calculateTotalPages(processedElements);
        console.log("Calculated totalPages:", totalPages);
        
        const chapterData = elements.chaptersData.map((chapter) => ({
            ...chapter,
            elementId:
                processedElements.find(
                    (element) => element.elementId === chapter.elementId
                )?.lineY + "" || "someId",
            id: uuidv4(),
        }));
        
        mutation.mutate({
            bookElements: processedElements,
            metaData: elements.metaData,
            userId: user.id,
            accessToken: accessToken,
            chaptersData: chapterData,
            coverImage: elements.coverImage,
            totalPages: totalPages, // Make sure this is passed to the mutation
            setBooksLoading,
        });
    };

    const handleEpubChange = async (file: File) => {
        try {
            const { paragraphs, metaData, coverImage } = await readEpub(file);
            console.log("epubElements", paragraphs);
            const epubElements = preprocessEpub(paragraphs);
            console.log("epubElements", epubElements);

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
                elementId: item.id || "someId",
                title: item.title,
                href: item.href || undefined,
                indentLevel: calculateIndentLevel(item.href),
            }));
            console.log("chaptersData", chaptersData);

            return { epubElements, metaData, coverImage, chaptersData };
        } catch (error) {
            console.error("Failed to load EPUB", error);
            setError("Failed to load EPUB. Please try another file.");
        }
    };
    function calculateIndentLevel(href: string | undefined) {
        if (!href) return undefined;
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

    // Calculate total pages based on book elements
    const calculateTotalPages = (bookElements: ProcessedElement[], fontSize: number = 16): number => {
        if (!bookElements || bookElements.length === 0) return 0;
        
        // Calculate how many lines fit in a page based on viewport height
        const viewportHeight = window.innerHeight;
        const lineHeight = settings?.lineHeight || 1.5; // Use settings or default
        const linesPerPage = Math.floor(viewportHeight / (fontSize * lineHeight));
        
        // Get the total number of lines in the book
        const lastElement = bookElements[bookElements.length - 1];
        const totalLines = lastElement.lineY + 1; // +1 because lineY is zero-indexed
        
        // Calculate total pages
        return Math.ceil(totalLines / linesPerPage);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={handleButtonClick}
        >
            <Plus size={20} />
            {!isCollapsed && <span className="ml-2">Add Book</span>}
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept=".epub"
                onChange={processBookElements}
            />
        </Button>
    );
}
