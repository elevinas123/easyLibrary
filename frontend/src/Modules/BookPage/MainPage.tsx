// src/pages/MainPage.tsx
import { useEffect, useState } from "react";
import Chapters from "./Chapters";
import KonvaStage from "./Konva/KonvaStage";
import RightHand from "./RightHand";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/userAuth";
import { useAtom } from "jotai";
import { arrowsAtom, canvaElementsAtom } from "./Konva/konvaAtoms";
import { CanvaElement } from "./Konva/shapes/CanvasElement";
import { Book } from "../LibraryPage/LibraryPage";
import { CurveElement } from "./Konva/shapes/ArrowShape";

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

const updateCanvaElements = async (
    canvaElements: CanvaElement[],
    id: string | null,
    accessToken: string | null
) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    if (id === null) {
        throw new Error("Book ID is null");
    }
    const { data } = await axios.put(
        `/api/book/${id}/canvaElements`,
        { canvaElements },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    console.log("data", data);
    console.log("canvaElements", canvaElements);
    return data;
};

const updateCurveElements = async (
    curveElements: CurveElement[],
    id: string | null,
    accessToken: string | null
) => {
    if (!accessToken) {
        throw new Error("Access token is null");
    }
    if (id === null) {
        throw new Error("Book ID is null");
    }
    console.log("updatingCurveElements", curveElements);
    const { data } = await axios.put(
        `/api/book/${id}/curveElements`,
        { curveElements: curveElements },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    console.log("data", data);
    console.log("canvaElements", curveElements);
    return data;
};
function MainPage() {
    const { accessToken, user } = useAuth();

    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("id");
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [chapters] = useState<Chapter[]>([]);

    const {
        data: book,
        error,
        isLoading,
    } = useQuery<Book>({
        queryKey: ["book", bookId],
        enabled: !!accessToken && !!user,
        queryFn: () => fetchBook(bookId, accessToken),
    });

    useEffect(() => {
        if (book) {
            console.log("curveElementsData", book.curveElements);
            setArrows(book.curveElements);
        }
    }, [book]);
    useEffect(() => {
        if (book) {
            console.log("canvaElementsData", book.canvaElements);
            setCanvaElements(book.canvaElements);
        }
    }, [book]);
    useEffect(() => {
        updateCurveElements(arrows, bookId, accessToken);
    }, [arrows]);
    useEffect(() => {
        updateCanvaElements(canvaElements, bookId, accessToken);
    }, [canvaElements]);

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
