// src/pages/MainPage.tsx
import { useEffect, useState } from "react";
import Chapters from "./Chapters";
import KonvaStage from "./Konva/KonvaStage";
import RightHand from "./RightHand";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/userAuth";

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
const fetchBook = async (id: string | null, accessToken: string | null) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    if (id === null) {
        throw new Error("Book ID is null");
    }
    const { data } = await axios.get(`/api/book/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
};

function MainPage() {
    // Use custom hook to handle authentication
    const { accessToken, user } = useAuth();

    // Use useQuery to fetch the book by ID
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("id");

    const {
        data: book,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["book", bookId], // Use dynamic bookId in the queryKey
        enabled: !!accessToken && !!user,
        queryFn: () => fetchBook(bookId, accessToken), // Fetch book data
    });

    const [chapters, setChapters] = useState<Chapter[]>([]);

    useEffect(() => {
        if (book) {
            console.log("book", book);
        }
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
