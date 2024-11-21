import { useEffect, useState } from "react";
import { Book } from "../endPointTypes/types";

export const useSidebar = (bookData: Book[] |undefined | null = null) => {
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => setIsCollapsed((prev) => !prev);

    useEffect(() => {
        // Perform an operation when bookData changes
        if (bookData) {
            setBooksLoading((prev) => prev.slice(0, prev.length - 1));
        }
    }, [bookData]);

    return {
        booksLoading,
        setBooksLoading,
        isCollapsed,
        toggleCollapse,
    };
};
