import { useQuery } from "@tanstack/react-query";
import BookCards from "./BookCards";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useEffect } from "react";
import ImportBook from "./importBook";
import { ProcessedElement } from "../../preprocess/epub/htmlToBookElements";

type LibraryPageProps = {
    // Define your prop types here
};

const fetchBooks = async () => {
    const { data } = await axios.get("/api/book");
    return data;
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

export default function LibraryPage({}: LibraryPageProps) {
    const {
        data: bookData,
        isLoading,
        error,
    } = useQuery<Book[]>({
        queryKey: ["book"],
        queryFn: fetchBooks,
    });

    useEffect(() => {
        console.log("data", bookData);
    }, [bookData]);
    return (
        <div className="bg-zinc-800 flex flex-row">
            <Sidebar />
            <BookCards bookData={bookData} />
        </div>
    );
}
