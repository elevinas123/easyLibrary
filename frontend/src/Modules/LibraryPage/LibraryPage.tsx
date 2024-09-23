import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../hooks/userAuth";
import { ProcessedElement } from "../../preprocess/epub/htmlToBookElements";
import BookCards from "./BookCards";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

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
};

const fetchBooks = async (): Promise<Book[]> => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }
    const response = await axios.get("/api/book", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default function LibraryPage({}: LibraryPageProps) {
    const { accessToken, user } = useAuth();
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    // Fetch books only if the user is logged in
    useEffect(() => {
        console.log("accessToken", accessToken);
        console.log("user", user);
    }, [accessToken, user]);
    useEffect(() => {
        console.log("booksLoading", booksLoading);
    }, [booksLoading]);
    const {
        data: bookData,
        isLoading,
        error,
    } = useQuery<Book[], AxiosError>({
        queryKey: ["book"],
        queryFn: fetchBooks,

        enabled: !!accessToken && !!user,
    });
    useEffect(() => {
        setBooksLoading((prev) => prev.slice(0, prev.length - 1));
    }, [bookData]);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if (error.response?.status === 401) {
            return <div>Unauthorized</div>;
        } else {
            return <div>An error occurred: {error.message}</div>;
        }
    }

    return (
        <div className="bg-zinc-800 flex flex-row">
            <Sidebar setBooksLoading={setBooksLoading} />
            <BookCards bookData={bookData} booksLoading={booksLoading} />
        </div>
    );
}
