import { useQuery } from "@tanstack/react-query";
import BookCards from "./BookCards";
import Sidebar from "./Sidebar";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { ProcessedElement } from "../../preprocess/epub/htmlToBookElements";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { accessTokenAtom, userAtom } from "../../atoms";

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
    const [user] = useAtom(userAtom);
    const [accessToken] = useAtom(accessTokenAtom);
    const navigate = useNavigate();

    // Redirect to login if the user is not logged in
    useEffect(() => {
        if (!accessToken || !user) {
            navigate("/login");
        }
    }, [user, accessToken, navigate]);

    // Fetch books only if the user is logged in
    const {
        data: bookData,
        isLoading,
        error,
    } = useQuery<Book[], AxiosError>({
        queryKey: ["book"],
        queryFn: fetchBooks,
        enabled: !!accessToken && !!user,
    });

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
            <Sidebar />
            <BookCards bookData={bookData} />
        </div>
    );
}
