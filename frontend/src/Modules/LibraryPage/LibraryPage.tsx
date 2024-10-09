import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Heart, Moon, Sun, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "../../components/ui/card";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/userAuth";
import BookInfoPage from "./BookInfoPage";
import Sidebar from "./Sidebar";
import { BookType } from "./api/book/schema/book.schema";



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

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [infoOpen, setInfoOpen] = useState(true);
    const [selectedBook, setSelectedBook] = useState<null | BookType>(null);
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [booksLoading, setBooksLoading] = useState<string[]>([]);

    const { toast } = useToast();
    const { data: bookData } = useQuery({
        queryKey: ["book"],
        queryFn: () => fetchBooks(user?._id),

        enabled: !!accessToken && !!user,
    });
    useEffect(() => {
        setBooksLoading((prev) => prev.slice(0, prev.length - 1));
    }, [bookData]);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {bookData.map((book) => (
                        <Card key={book._id} className="flex flex-col">
                            <CardHeader className="relative p-0">
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="w-full h-96 object-cover rounded-t-lg"
                                />
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Heart className="h-4 w-4" />
                                        <span className="sr-only">Like</span>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-4">
                                <h3 className="text-lg font-semibold">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {book.author}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Added: {book.dateAdded}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Genre: {book.genre}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4">
                                <Button
                                    className="w-full"
                                    onClick={() => setSelectedBook(book)}
                                >
                                    <BookOpen className="mr-2 h-4 w-4" /> Read
                                    Book
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
            <BookInfoPage
                infoOpen={infoOpen}
                selectedBook={selectedBook}
                setInfoOpen={setInfoOpen}
            />
        </div>
    );
}
