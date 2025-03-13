import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Book } from "../../endPointTypes/types";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useAuth } from "../../hooks/userAuth";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";
import Sidebar from "../LibraryPage/Sidebar";
import BookCard from "../LibraryPage/BookCard";
import BookCardSkeleton from "../LibraryPage/BookCardSkeleton";
import { BookOpen, Clock } from "lucide-react";

export default function CurrentlyReadingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    // Fetch currently reading books
    const { data: currentlyReadingBooks, isLoading } = useQuery({
        queryKey: ["currentlyReadingBooks", user?.id],
        queryFn: async () => {
            const data = await apiFetch(
                "GET /book/getCurrentlyReading",
                {
                    query: {
                        userId: user?.id,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return data.data as Book[];
        },
        enabled: !!user?.id,
    });

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const selectBook = (bookId: string) => {
        navigate(`/book?id=${bookId}`);
    };

    const deleteBook = async (bookId: string) => {
        // Implementation for removing a book from currently reading
        // This might just update a status rather than deleting the book
        console.log("Remove from currently reading:", bookId);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar 
                isCollapsed={isCollapsed} 
                toggleCollapse={toggleCollapse} 
                setBooksLoading={setBooksLoading} 
            />
            
            <main className={cn(
                "flex-1 overflow-y-auto p-6",
                isDarkMode ? "bg-zinc-900" : "bg-gray-50"
            )}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Clock className={cn(
                            "mr-3 h-8 w-8",
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                        )} />
                        <h1 className={cn(
                            "text-3xl font-bold",
                            isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                            Currently Reading
                        </h1>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <BookCardSkeleton key={i} isDarkMode={isDarkMode} />
                            ))}
                        </div>
                    ) : currentlyReadingBooks && currentlyReadingBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentlyReadingBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    deleteBook={deleteBook}
                                    selectBook={selectBook}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={cn(
                            "text-center py-16 px-4 rounded-lg",
                            isDarkMode ? "bg-zinc-800/50" : "bg-gray-100/50"
                        )}>
                            <BookOpen className={cn(
                                "mx-auto h-12 w-12 mb-4",
                                isDarkMode ? "text-gray-600" : "text-gray-400"
                            )} />
                            <h3 className={cn(
                                "text-xl font-medium mb-2",
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>
                                No books in progress
                            </h3>
                            <p className={cn(
                                "mb-6 max-w-md mx-auto",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}>
                                You don't have any books in progress. Start reading a book from your library to see it here.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className={cn(
                                    "px-4 py-2 rounded-md font-medium",
                                    isDarkMode 
                                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                )}
                            >
                                Go to Library
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 