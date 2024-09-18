import { useQuery } from "@tanstack/react-query";
import BookCards from "./BookCards";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useEffect } from "react";

type LibraryPageProps = {
    // Define your prop types here
};

const fetchBooks = async () => {
    const { data } = await axios.get("/api/book");
    return data;
};


export default function LibraryPage({}: LibraryPageProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["book"],
        queryFn: fetchBooks,
    });

    useEffect(() => {
        console.log("data", data);
    }, [data]);
    return (
        <div className="bg-zinc-800 flex flex-row">
            <Sidebar />
            <BookCards />
        </div>
    );
}
