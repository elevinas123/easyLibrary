import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../hooks/userAuth";
import { ProcessedElement } from "../../preprocess/epub/htmlToBookElements";
import BookCards from "./BookCards";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/use-toast";
import BookInfoPage from "./BookInfoPage";
import { CanvaElement } from "../BookPage/Konva/shapes/CanvaElement";
import { CurveElement } from "../BookPage/Konva/shapes/Arrow/ArrowShape";
import { Highlight } from "../BookPage/Konva/konvaAtoms";
import { apiFetch } from "../../endPointTypes/apiClient";

type LibraryPageProps = {
    // Define your prop types here
};

export type Book = {
    _id: string;
    title: string;
    description: string;
    author: string;
    genre: string[];
    imageUrl: string;
    liked: boolean;
    dateAdded: Date;
    bookElements: ProcessedElement[];
    curveElements: CurveElement[];
    canvaElements: CanvaElement[];
    highlights: Highlight[];
    scale: number;
    offsetPosition: { x: number; y: number };
};

const fetchBooks = async (userId: string | undefined) => {
    if (!userId) {
        throw new Error("No user ID found");
    }
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    const data = await apiFetch(
        "GET /book/getUserBooks",
        {
            query: {
                userId: userId,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data.data;
};

export default function LibraryPage({}: LibraryPageProps) {
    const { accessToken, user } = useAuth();
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    // Fetch books only if the user is logged in
    const queryClient = useQueryClient();
    const [bookSelected, setBookSelected] = useState<string | null>(null);
    const { toast } = useToast();
    const {
        data: bookData,
        isLoading,
        error,
    } = useQuery<Book[], AxiosError>({
        queryKey: ["book"],
        queryFn: () => fetchBooks(user?._id),

        enabled: !!accessToken && !!user,
    });
    useEffect(() => {
        setBooksLoading((prev) => prev.slice(0, prev.length - 1));
    }, [bookData]);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const deleteBook = async (bookId: string) => {
        try {
            const bookDeleted = await apiFetch(
                "DELETE /book/:id",
                { params: { id: bookId } },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (bookDeleted.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["book"] });
                toast({
                    title: "Book Deleted successfully",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Failed to delete book",
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const selectBook = (bookId: string) => {
        setBookSelected(bookId);
    };
    if (error) {
        if (error.response?.status === 401) {
            return <div>Unauthorized</div>;
        } else {
            return <div>An error occurred: {error.message}</div>;
        }
    }
    const updateBook = async (updatedBook: Book) => {
        try {
            const bookUpdated = await apiFetch(
                "PATCH /book/:id",
                { params: { id: updatedBook._id }, body: updatedBook },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (bookUpdated.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["book"] });
                toast({
                    title: "Book Updated successfully",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Failed to update book",
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const book = bookData?.filter((book) => book._id === bookSelected);
    return (
        <div className="bg-zinc-800 flex flex-row h-screen">
            <Sidebar setBooksLoading={setBooksLoading} />
            <div className="flex flex-row flex-1">
                <div className="flex-1 overflow-y-auto">
                    <BookCards
                        bookData={bookData}
                        booksLoading={booksLoading}
                        deleteBook={deleteBook}
                        selectBook={selectBook}
                    />
                </div>
                {book && book.length > 0 && (
                    <BookInfoPage
                        book={book[0]}
                        deleteBook={deleteBook}
                        updateBook={updateBook}
                    />
                )}
            </div>
        </div>
    );
}
