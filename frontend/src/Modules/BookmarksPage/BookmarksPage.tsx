import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Book, Bookmark } from "../../endPointTypes/types";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useAuth } from "../../hooks/userAuth";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";
import Sidebar from "../LibraryPage/Sidebar";
import { Bookmark as BookmarkIcon, Search, Book as BookIcon, Calendar, Clock } from "lucide-react";
import { Input } from "../../components/ui/input";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";

type BookmarkWithBook = Bookmark & {
  book: Book;
};

export default function BookmarksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    // Fetch bookmarks
    const { data: bookmarks, isLoading } = useQuery({
        queryKey: ["bookmarks", user?.id],
        queryFn: async () => {
            const data = await apiFetch(
                "GET /bookmark/getUserBookmarks",
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
            return data.data as BookmarkWithBook[];
        },
        enabled: !!user?.id,
    });

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const navigateToBookmark = (bookmark: BookmarkWithBook) => {
        navigate(`/book?id=${bookmark.book.id}&page=${bookmark.page}&position=${bookmark.position}`);
    };

    const deleteBookmark = async (bookmarkId: string) => {
        // Implementation for removing a bookmark
        console.log("Delete bookmark:", bookmarkId);
    };

    // Filter bookmarks based on search query
    const filteredBookmarks = bookmarks?.filter(bookmark => {
        const query = searchQuery.toLowerCase();
        return (
            bookmark.book.title.toLowerCase().includes(query) ||
            bookmark.book.author.toLowerCase().includes(query) ||
            bookmark.name.toLowerCase().includes(query)
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
                            <BookmarkIcon className={cn(
                                "mr-3 h-8 w-8",
                                isDarkMode ? "text-purple-400" : "text-purple-600"
                            )} />
                            <h1 className={cn(
                                "text-3xl font-bold",
                                isDarkMode ? "text-white" : "text-gray-900"
                            )}>
                                Bookmarks
                            </h1>
                        </div>
                        
                        {bookmarks && bookmarks.length > 0 && (
                            <div className="relative w-64">
                                <Search className={cn(
                                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                )} />
                                <Input
                                    type="text"
                                    placeholder="Search bookmarks..."
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
                        <div className="grid gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <BookmarkSkeleton key={i} isDarkMode={isDarkMode} />
                            ))}
                        </div>
                    ) : filteredBookmarks && filteredBookmarks.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredBookmarks.map((bookmark) => (
                                <BookmarkCard
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    deleteBookmark={deleteBookmark}
                                    navigateToBookmark={navigateToBookmark}
                                    isDarkMode={isDarkMode}
                                />
                            ))}
                        </div>
                    ) : bookmarks && bookmarks.length > 0 && searchQuery ? (
                        <div className="text-center py-8">
                            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                                No bookmarks match your search criteria.
                            </p>
                        </div>
                    ) : (
                        <div className={cn(
                            "text-center py-16 px-4 rounded-lg",
                            isDarkMode ? "bg-zinc-800/50" : "bg-gray-100/50"
                        )}>
                            <BookmarkIcon className={cn(
                                "mx-auto h-12 w-12 mb-4",
                                isDarkMode ? "text-gray-600" : "text-gray-400"
                            )} />
                            <h3 className={cn(
                                "text-xl font-medium mb-2",
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>
                                No bookmarks yet
                            </h3>
                            <p className={cn(
                                "mb-6 max-w-md mx-auto",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}>
                                Add bookmarks while reading to save your place and quickly return to important sections.
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

// Bookmark Card Component
function BookmarkCard({ 
    bookmark, 
    deleteBookmark, 
    navigateToBookmark,
    isDarkMode
}: { 
    bookmark: BookmarkWithBook; 
    deleteBookmark: (id: string) => Promise<void>;
    navigateToBookmark: (bookmark: BookmarkWithBook) => void;
    isDarkMode: boolean;
}) {
    return (
        <div 
            className={cn(
                "p-4 rounded-lg border transition-all hover:shadow-md",
                isDarkMode 
                    ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700" 
                    : "bg-white border-gray-200 hover:bg-gray-50"
            )}
        >
            <div className="flex items-start gap-4">
                {bookmark.book.coverImage ? (
                    <img 
                        src={bookmark.book.coverImage} 
                        alt={bookmark.book.title}
                        className="w-16 h-24 object-cover rounded"
                    />
                ) : (
                    <div className={cn(
                        "w-16 h-24 flex items-center justify-center rounded",
                        isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                    )}>
                        <BookIcon className={isDarkMode ? "text-zinc-500" : "text-gray-400"} />
                    </div>
                )}
                
                <div className="flex-1">
                    <h3 className={cn(
                        "font-medium mb-1",
                        isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                        {bookmark.name || `Page ${bookmark.page}`}
                    </h3>
                    
                    <p className={cn(
                        "text-sm mb-2",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                        {bookmark.book.title} by {bookmark.book.author}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs mb-3">
                        <div className={cn(
                            "flex items-center",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                        )}>
                            <Calendar className="h-3 w-3 mr-1" />
                            {bookmark.createdAt ? format(new Date(bookmark.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                        </div>
                        
                        <div className={cn(
                            "flex items-center",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                        )}>
                            <Clock className="h-3 w-3 mr-1" />
                            Page {bookmark.page}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteBookmark(bookmark.id)}
                            className={isDarkMode ? "border-zinc-700 hover:bg-zinc-700" : ""}
                        >
                            Delete
                        </Button>
                        <Button 
                            size="sm"
                            onClick={() => navigateToBookmark(bookmark)}
                        >
                            Go to bookmark
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Bookmark Skeleton Component
function BookmarkSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <div className={cn(
            "p-4 rounded-lg border animate-pulse",
            isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
            <div className="flex items-start gap-4">
                <div className={cn(
                    "w-16 h-24 rounded",
                    isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                )} />
                
                <div className="flex-1">
                    <div className={cn(
                        "h-5 rounded mb-2 w-3/4",
                        isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                    )} />
                    
                    <div className={cn(
                        "h-4 rounded mb-3 w-1/2",
                        isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                    )} />
                    
                    <div className="flex items-center gap-4 mb-3">
                        <div className={cn(
                            "h-3 rounded w-20",
                            isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                        )} />
                        
                        <div className={cn(
                            "h-3 rounded w-16",
                            isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                        )} />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <div className={cn(
                            "h-8 rounded w-16",
                            isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                        )} />
                        <div className={cn(
                            "h-8 rounded w-28",
                            isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                        )} />
                    </div>
                </div>
            </div>
        </div>
    );
} 