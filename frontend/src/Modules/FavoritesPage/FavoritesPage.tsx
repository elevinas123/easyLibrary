import { useState } from "react";
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
import { Heart, Search } from "lucide-react";
import { Input } from "../../components/ui/input";

export default function FavoritesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    // Fetch favorite books
    const { data: favoriteBooks, isLoading } = useQuery({
        queryKey: ["favoriteBooks", user?.id],
        queryFn: async () => {
            const data = await apiFetch(
                "GET /book/getFavorites",
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
        // Implementation for removing a book from favorites
        console.log("Remove from favorites:", bookId);
    };

    // Filter books based on search query
    const filteredBooks = favoriteBooks?.filter(book => {
        const query = searchQuery.toLowerCase();
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genres?.some(genre => genre.toString().toLowerCase().includes(query))
        );
    });

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
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Heart className={cn(
                                "mr-3 h-8 w-8",
                                isDarkMode ? "text-red-400" : "text-red-600"
                            )} />
                            <h1 className={cn(
                                "text-3xl font-bold",
                                isDarkMode ? "text-white" : "text-gray-900"
                            )}>
                                Favorites
                            </h1>
                        </div>
                        
                        {favoriteBooks && favoriteBooks.length > 0 && (
                            <div className="relative w-64">
                                <Search className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                )} />
                                <Input
                                    type="text"
                                    placeholder="Search favorites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={cn(
                                        "pl-10",
                                        isDarkMode 
                                            ? "bg-zinc-800 border-zinc-700" 
                                            : "bg-white border-gray-200"
                                    )}
                                />
                            </div>
                        )}
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <BookCardSkeleton key={i} isDarkMode={isDarkMode} />
                            ))}
                        </div>
                    ) : filteredBooks && filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    deleteBook={deleteBook}
                                    selectBook={selectBook}
                                />
                            ))}
                        </div>
                    ) : favoriteBooks && favoriteBooks.length > 0 && searchQuery ? (
                        <div className="text-center py-8">
                            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                                No favorites match your search criteria.
                            </p>
                        </div>
                    ) : (
                        <div className={cn(
                            "text-center py-16 px-4 rounded-lg",
                            isDarkMode ? "bg-zinc-800/50" : "bg-gray-100/50"
                        )}>
                            <Heart className={cn(
                                "mx-auto h-12 w-12 mb-4",
                                isDarkMode ? "text-gray-600" : "text-gray-400"
                            )} />
                            <h3 className={cn(
                                "text-xl font-medium mb-2",
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>
                                No favorite books yet
                            </h3>
                            <p className={cn(
                                "mb-6 max-w-md mx-auto",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}>
                                Mark books as favorites to quickly access them here.
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