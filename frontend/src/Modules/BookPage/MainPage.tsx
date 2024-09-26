// src/pages/MainPage.tsx
import { useEffect, useState, useCallback } from "react";
import Chapters from "./Chapters";
import KonvaStage from "./Konva/KonvaStage";
import RightHand from "./RightHand";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/userAuth";
import { useAtom } from "jotai";
import {
    arrowsAtom,
    canvaElementsAtom,
    highlightsAtom,
    offsetPositionAtom,
    scaleAtom,
} from "./Konva/konvaAtoms";
import { Book } from "../LibraryPage/LibraryPage";
import debounce from "lodash/debounce";
import { set } from "lodash";

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
const fetchBook = async (id: string, accessToken: string): Promise<Book> => {
    const { data } = await axios.get(`/api/book/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return data;
};

// Unified update function using PATCH
const patchBook = async (
    updateData: Partial<Book>,
    id: string,
    accessToken: string
): Promise<Book> => {
    const { data } = await axios.patch(`/api/book/${id}`, updateData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log("Updated Book Data:", data);
    return data;
};

function MainPage() {
    const { accessToken, user } = useAuth();
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("id");

    // Initialize atoms
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [highlights, setHighlights] = useAtom(highlightsAtom);
    const [scale, setScale] = useAtom(scaleAtom);
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);

    // Initialize chapters (assuming this will be populated elsewhere)
    const [chapters] = useState<Chapter[]>([]);
    const queryClient = useQueryClient();

    // React Query: Fetch book data
    const {
        data: book,
        error,
        isLoading,
    } = useQuery<Book, Error>({
        queryFn: () => fetchBook(bookId!, accessToken!),
        queryKey: ["book", bookId],
        enabled: !!accessToken && !!user && !!bookId,
    });

    // React Query: Mutation for updating the book
    const mutation = useMutation<Book, Error, Partial<Book>, unknown>({
        mutationFn: (updateData) =>
            patchBook(updateData, bookId!, accessToken!),
        onError: (error) => {
            console.error("Error updating book:", error.message);
            // Optionally, display an error message to the user
        },
        onSuccess: (data) => {
            console.log("Book updated successfully:", data);
            queryClient.setQueryData<Book>(["book", bookId], data);
        },
    });

    // Debounced update function
    const debouncedUpdate = useCallback(
        debounce((updatedFields: Partial<Book>) => {
            mutation.mutate(updatedFields);
        }, 500), // Adjust the delay as needed (e.g., 1000ms)
        [mutation]
    );
    useEffect(() => {
        setArrows(book?.curveElements ?? []);
        setCanvaElements(book?.canvaElements ?? []);
        setHighlights(book?.highlights ?? []);
        setScale(book?.scale ?? 1);
        setOffsetPosition(
            book?.offsetPosition ?? {
                x: 0,
                y: 0,
            }
        );
        console.log("Book data updated:", book);
    }, [book]);

    // Consolidated useEffect for updating the book
    useEffect(() => {
        if (!bookId || !accessToken || !book) return;

        const updateData: Partial<Book> = {};

        if (arrows !== book.curveElements) {
            updateData.curveElements = arrows;
        }
        if (canvaElements !== book.canvaElements) {
            updateData.canvaElements = canvaElements;
        }
        if (highlights !== book.highlights) {
            updateData.highlights = highlights;
        }
        if (scale !== book.scale) {
            updateData.scale = scale;
        }
        if (offsetPosition !== book.offsetPosition) {
            updateData.offsetPosition = offsetPosition;
        }

        // If there are changes, debounce the update
        if (Object.keys(updateData).length > 0) {
            debouncedUpdate(updateData);
        }

        // Cleanup on unmount
        return () => {
            debouncedUpdate.cancel();
        };
    }, [
        arrows,
        canvaElements,
        highlights,
        scale,
        offsetPosition,
        book,
        bookId,
        accessToken,
        debouncedUpdate,
    ]);

    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading book: {error.message}</div>;
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
