import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Moon, Sun, Search, Filter, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/userAuth";
import { useSidebar } from "../../hooks/useSidebar";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";
import BookInfoPage from "./BookInfoPage";
import Sidebar from "./Sidebar";
import { Book, BookGenre } from "../../endPointTypes/types";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";

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

export default function LibraryPage() {
    const { accessToken, user } = useAuth();
    const [infoOpen, setInfoOpen] = useState(true);
    const [selectedBook, setSelectedBook] = useState<null | string>(null);
    const [mounted, setMounted] = useState(false);
    const [themeMode, setThemeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    
    const queryClient = useQueryClient();
    const { toast } = useToast();
    
    const { data: bookData } = useQuery<Book[]>({
        queryKey: ["book"],
        queryFn: () => fetchBooks(user?.id) as Promise<Book[]>,
        enabled: !!accessToken && !!user,
    });
    
    const { booksLoading, setBooksLoading, isCollapsed, toggleCollapse } =
        useSidebar(bookData);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    
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
                if (selectedBook === bookId) {
                    setSelectedBook(null);
                }
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
        setSelectedBook(bookId);
        setInfoOpen(true);
    };
    
    const filteredBooks = bookData?.filter(book => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genres?.some((genre: BookGenre) => genre.name.toLowerCase().includes(query))
        );
    });
    
    const book = bookData?.filter((book) => book.id === selectedBook)[0];
    
    if (!bookData) return null;
    
    return (
        <div className={cn(
            "flex h-screen",
            isDarkMode ? "bg-gray-950" : "bg-amber-50"
        )}>
            <Sidebar
                toggleCollapse={toggleCollapse}
                isCollapsed={isCollapsed}
                setBooksLoading={setBooksLoading}
            />
            
            {/* Main Content */}
            <main className={cn(
                "flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out",
                isDarkMode ? "text-gray-200" : "text-gray-900"
            )}>
                <div className="flex flex-col space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className={cn(
                            "text-3xl font-serif font-bold",
                            isDarkMode ? "text-gray-100" : "text-amber-800"
                        )}>My Library</h1>
                        
                    </div>
                    
                    <div className="relative">
                        <Search className={cn(
                            "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                            isDarkMode ? "text-gray-500" : "text-amber-500"
                        )} />
                        <Input
                            placeholder="Search by title, author, or genre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "pl-10",
                                isDarkMode 
                                    ? "bg-gray-900 border-gray-800 text-gray-200 placeholder:text-gray-500" 
                                    : "bg-white border-amber-200 text-gray-900 placeholder:text-gray-400"
                            )}
                        />
                    </div>
                   
                </div>
                
                {filteredBooks?.length === 0 ? (
                    <div className={cn(
                        "text-center py-12",
                        isDarkMode ? "text-gray-400" : "text-amber-600"
                    )}>
                        <p className="text-lg">No books found matching your search.</p>
                        {searchQuery && (
                            <Button 
                                variant="link" 
                                onClick={() => setSearchQuery("")}
                                className={isDarkMode ? "text-amber-400" : "text-amber-700"}
                            >
                                Clear search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredBooks?.map((book) => (
                            <BookCard
                                key={book.id}
                                deleteBook={deleteBook}
                                book={book}
                                selectBook={selectBook}
                                isSelected={selectedBook === book.id}
                            />
                        ))}
                        {booksLoading.map((bookId) => (
                            <BookCardSkeleton key={bookId} isDarkMode={isDarkMode} />
                        ))}
                    </div>
                )}
                
                {filteredBooks?.length === 0 && bookData.length > 0 && searchQuery && (
                    <div className="mt-8 text-center">
                        <p className={isDarkMode ? "text-gray-400" : "text-amber-600"}>
                            No books match your search criteria.
                        </p>
                    </div>
                )}
                
                {bookData.length === 0 && booksLoading.length === 0 && (
                    <div className={cn(
                        "text-center py-16 px-4 rounded-lg border",
                        isDarkMode 
                            ? "bg-gray-900/30 border-gray-800" 
                            : "bg-amber-50 border-amber-200"
                    )}>
                        <BookOpen className={cn(
                            "mx-auto h-12 w-12 mb-4",
                            isDarkMode ? "text-amber-500" : "text-amber-500"
                        )} />
                        <h3 className={cn(
                            "text-xl font-serif font-medium mb-2",
                            isDarkMode ? "text-gray-200" : "text-amber-800"
                        )}>
                            Your library is empty
                        </h3>
                        <p className={cn(
                            "mb-6 max-w-md mx-auto",
                            isDarkMode ? "text-gray-400" : "text-amber-700"
                        )}>
                            Start by adding some books to your library using the "Add Book" button in the sidebar.
                        </p>
                        <Button
                            className={cn(
                                "bg-amber-600 hover:bg-amber-700 text-white",
                                "transition-all duration-200"
                            )}
                            onClick={() => toggleCollapse(false)}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Add Your First Book
                        </Button>
                    </div>
                )}
            </main>
            
            <BookInfoPage
                infoOpen={infoOpen}
                selectedBook={book}
                setInfoOpen={setInfoOpen}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}
