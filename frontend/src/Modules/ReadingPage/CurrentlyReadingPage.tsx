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
import { BookOpen, Clock, Calendar, ChevronRight, User, BarChart3, ArrowRightCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";

// Types
type BookProgress = {
    id: string;
    percentComplete: number;
    currentPage: number;
    timeSpentReading: number; // in seconds
    lastReadAt: string;
    bookId: string;
};

export default function CurrentlyReadingPage() {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [booksLoading, setBooksLoading] = useState<string[]>([]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Fetch currently reading books
    const { data: currentlyReadingBooks, isLoading: booksLoading1 } = useQuery({
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
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("currentlyReadingBooks", data);
            return data.data.data as Book[];
        },
        enabled: !!user?.id && !!accessToken,
    });

    // Fetch reading progress for all books
    const { data: bookProgress, isLoading: progressLoading } = useQuery({
        queryKey: ["bookProgress", user?.id],
        queryFn: async () => {
            const data = await apiFetch(
                "GET /tracking/progress/all",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("bookProgress", data);
            return data.data as BookProgress[];
        },
        enabled: !!user?.id && !!accessToken,
    });

    // Function to get progress for a specific book
    const getBookProgress = (bookId: string) => {
        if (!bookProgress) return null;
        return bookProgress.find(progress => progress.bookId === bookId);
    };

    // Format time duration (seconds to readable format)
    const formatReadingTime = (seconds: number) => {
        if (!seconds) return "0 min";
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes} min`;
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    console.log("bookProgress", booksLoading, booksLoading1, progressLoading);
    const isLoading = booksLoading1 || progressLoading;
    console.log("currentlyReadingBooks", currentlyReadingBooks);
    return (
        <div className={cn(
            "flex h-screen",
            isDarkMode ? "bg-gray-900" : "bg-amber-50"
        )}>
            <Sidebar 
                isCollapsed={isCollapsed} 
                toggleCollapse={toggleCollapse} 
                setBooksLoading={setBooksLoading} 
            />
            
            <main className={cn(
                "flex-1 overflow-y-auto p-6",
                isDarkMode ? "text-gray-200" : "text-gray-800"
            )}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <BookOpen className={cn(
                                "mr-3 h-7 w-7",
                                isDarkMode ? "text-amber-500" : "text-amber-600"
                            )} />
                            <h1 className={cn(
                                "text-3xl font-serif font-bold",
                                isDarkMode ? "text-white" : "text-amber-800"
                            )}>
                                Currently Reading
                            </h1>
                        </div>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/history')}
                            className={cn(
                                isDarkMode 
                                    ? "border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800" 
                                    : "border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-amber-50"
                            )}
                        >
                            View Reading History
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <Card key={i} className={cn(
                                    "h-64 animate-pulse",
                                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                )}>
                                    <div className="h-full flex p-6">
                                        <div className={cn(
                                            "w-1/3 rounded",
                                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                        )}></div>
                                        <div className="w-2/3 pl-6 space-y-4">
                                            <div className={cn(
                                                "h-6 w-3/4 rounded",
                                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                            )}></div>
                                            <div className={cn(
                                                "h-4 w-1/2 rounded",
                                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                            )}></div>
                                            <div className={cn(
                                                "h-4 w-3/4 rounded",
                                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                            )}></div>
                                            <div className={cn(
                                                "h-2 w-full rounded",
                                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                            )}></div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : currentlyReadingBooks && currentlyReadingBooks.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {currentlyReadingBooks.map((book) => {
                                const progress = getBookProgress(book.id);
                                return (
                                    <Card key={book.id} className={cn(
                                        "overflow-hidden hover:shadow-md transition-all duration-200",
                                        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                    )}>
                                        <div className="flex h-full">
                                            <div 
                                                className="w-1/3 min-h-[230px] bg-cover bg-center"
                                                style={{ backgroundImage: `url(${book.imageUrl})` }}
                                            />
                                            <div className="w-2/3 p-5 flex flex-col">
                                                <CardHeader className="p-0 pb-3">
                                                    <CardTitle className={cn(
                                                        "text-xl font-serif line-clamp-2",
                                                        isDarkMode ? "text-white" : "text-amber-800"
                                                    )}>
                                                        {book.title}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center mt-1">
                                                        <User className="h-3.5 w-3.5 mr-1.5" />
                                                        {book.author}
                                                    </CardDescription>
                                                </CardHeader>
                                                
                                                <CardContent className="p-0 flex-grow">
                                                    {progress ? (
                                                        <div className="space-y-3 mt-2">
                                                            <div>
                                                                <div className="flex justify-between text-sm mb-1">
                                                                    <span className={cn(
                                                                        isDarkMode ? "text-gray-400" : "text-gray-500"
                                                                    )}>
                                                                        Progress
                                                                    </span>
                                                                    <span className={cn(
                                                                        isDarkMode ? "text-amber-400" : "text-amber-600"
                                                                    )}>
                                                                        {Math.round(progress.percentComplete * 100)}%
                                                                    </span>
                                                                </div>
                                                                <Progress 
                                                                    value={progress.percentComplete * 100} 
                                                                    className={cn(
                                                                        "h-2",
                                                                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                                    )}
                                                                    indicatorClassName="bg-amber-500"
                                                                />
                                                            </div>
                                                            
                                                            <div className="flex items-center text-sm">
                                                                <Calendar className="h-4 w-4 mr-1.5" />
                                                                <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                                                    Last read on {formatDate(progress.lastReadAt)}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center text-sm">
                                                                <BarChart3 className="h-4 w-4 mr-1.5" />
                                                                <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                                                    Page {progress.currentPage} of {book.totalPages || '?'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={cn(
                                                            "text-sm italic mt-2", 
                                                            isDarkMode ? "text-gray-400" : "text-gray-500"
                                                        )}>
                                                            No reading progress yet
                                                        </div>
                                                    )}
                                                </CardContent>
                                                
                                                <CardFooter className="p-0 pt-3 mt-auto">
                                                    <Button 
                                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                                                        onClick={() => navigate(`/book?id=${book.id}`)}
                                                    >
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        Continue Reading
                                                    </Button>
                                                </CardFooter>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className={cn(
                            "text-center py-16 px-4",
                            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                        )}>
                            <CardContent>
                                <BookOpen className={cn(
                                    "mx-auto h-12 w-12 mb-4",
                                    isDarkMode ? "text-gray-600" : "text-gray-400"
                                )} />
                                <h3 className={cn(
                                    "text-xl font-serif font-medium mb-2",
                                    isDarkMode ? "text-white" : "text-amber-800"
                                )}>
                                    No books in progress
                                </h3>
                                <p className={cn(
                                    "mb-6 max-w-md mx-auto",
                                    isDarkMode ? "text-gray-400" : "text-gray-600"
                                )}>
                                    You don't have any books in progress. Start reading a book from your library to see it here.
                                </p>
                                <Button
                                    onClick={() => navigate('/')}
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    <ArrowRightCircle className="mr-2 h-4 w-4" />
                                    Go to Library
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    
                    {currentlyReadingBooks && currentlyReadingBooks.length > 0 && (
                        <div className="mt-8">
                            <Separator className={cn(
                                "my-8",
                                isDarkMode ? "bg-gray-800" : "bg-gray-200"
                            )} />
                            
                            <div className={cn(
                                "flex items-center justify-between mb-4",
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>
                                <h2 className="text-xl font-serif font-medium">Reading Stats</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                
                                
                                <Card className={cn(
                                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                )}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                                            <BookOpen className="h-4 w-4 mr-1.5" />
                                            Books Reading
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className={cn(
                                            "text-2xl font-bold",
                                            isDarkMode ? "text-white" : "text-amber-800"
                                        )}>
                                            {currentlyReadingBooks?.length || 0}
                                        </p>
                                    </CardContent>
                                </Card>
                                
                                <Card className={cn(
                                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                )}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                                            <BarChart3 className="h-4 w-4 mr-1.5" />
                                            Pages Read
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className={cn(
                                            "text-2xl font-bold",
                                            isDarkMode ? "text-white" : "text-amber-800"
                                        )}>
                                            {bookProgress?.reduce((total, p) => total + (p.currentPage || 0), 0) || 0}
                                        </p>
                                    </CardContent>
                                </Card>
                                
                                <Card className={cn(
                                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                )}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                                            <Calendar className="h-4 w-4 mr-1.5" />
                                            Last Read
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className={cn(
                                            "text-2xl font-bold",
                                            isDarkMode ? "text-white" : "text-amber-800"
                                        )}>
                                            {bookProgress && bookProgress.length > 0 
                                                ? formatDate(
                                                    bookProgress.sort((a, b) => 
                                                        new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
                                                    )[0].lastReadAt
                                                  )
                                                : "Never"
                                            }
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 