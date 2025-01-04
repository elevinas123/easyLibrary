import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Moon, Sun } from "lucide-react";
import { Button } from "../../components/ui/button";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/userAuth";
import { useSettings } from "../../hooks/useSettings";
import { useSidebar } from "../../hooks/useSidebar";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";
import BookInfoPage from "./BookInfoPage";
import Sidebar from "./Sidebar";
import { Book } from "../../endPointTypes/types";

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
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const queryClient = useQueryClient();
    const { settings } = useSettings();
    useEffect(() => {
        console.log("settings", settings);
    }, []);
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
    };

    const updateBook = async (updatedBook: Book) => {
        try {
            const bookUpdated = await apiFetch(
                "PATCH /book/:id",
                { params: { id: updatedBook.id }, body: updatedBook },
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
    const book = bookData?.filter((book) => book.id === selectedBook)[0];
    if (!bookData) return null;
    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                toggleCollapse={toggleCollapse}
                isCollapsed={isCollapsed}
                setBooksLoading={setBooksLoading}
            />
            {/* Main Content */}
            <main
                className={`flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out `}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Library</h1>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                    >
                        {theme === "dark" ? (
                            <Sun className="h-[1.2rem] w-[1.2rem]" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem]" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {bookData.map((book) => (
                        <BookCard
                            deleteBook={deleteBook}
                            book={book}
                            selectBook={selectBook}
                        />
                    ))}
                    {booksLoading.map((bookId) => (
                        <BookCardSkeleton key={bookId} />
                    ))}
                </div>
            </main>
            <BookInfoPage
                infoOpen={infoOpen}
                selectedBook={book}
                setInfoOpen={setInfoOpen}
            />
        </div>
    );
}
