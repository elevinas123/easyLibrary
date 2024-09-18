import { useEffect, useState } from "react";
import { ProcessedElement } from "../../preprocess/epub/htmlToBookElements.ts";
import Chapters from "./Chapters.tsx";
import KonvaStage from "./Konva/KonvaStage.tsx";
import RightHand from "./RightHand.tsx";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export type HighlightRange = {
    startElementId: string;
    startOffset: number;
    endElementId: string;
    endOffset: number;
    highlightedText: string;
    intermediateElementIds?: string[];
    highlightId: string;
};

export type Chapter = {
    id: string;
    title: string;
    href: string | undefined;
    indentLevel: number | null;
};

// Fetch book function
const fetchBook = async (id: string | null) => {
    if (id === null) {
        throw new Error("Book ID is null");
    }
    const { data } = await axios.get(`/api/book/${id}`);
    return data;
};

function MainPage() {
    // Use useQuery to fetch the book by ID
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("id");
    const {
        data: book,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["book", "bookId"], // you can pass the book id dynamically
        queryFn: () => fetchBook(bookId), // replace "bookId" with the actual book ID if dynamic
    });
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [_, setError] = useState<string | null>(null);
    useEffect(() => {
        console.log("book", book);
    }, [book]);
    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading book: {(error as Error).message}</div>;
    }

    // Extract book elements from the fetched book data
    const bookElements = book?.bookElements ?? [];

    return (
        <div className="flex min-h-screen flex-row w-full bg-zinc-800 text-gray-300 relative">
            <Chapters chapters={chapters} />

            <div className="w-full flex flex-col items-center relative h-screen overflow-y-scroll custom-scrollbar">
                <KonvaStage bookElements={bookElements} />
            </div>
            <RightHand />
        </div>
    );
}

export default MainPage;
