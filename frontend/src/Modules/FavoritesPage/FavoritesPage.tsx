import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Book } from "../../endPointTypes/types";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useAuth } from "../../hooks/userAuth";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";
import Sidebar from "../LibraryPage/Sidebar";
import { 
    Heart, BookOpen, Search, Plus, Clock, 
    SortAsc, SortDesc, Grid, List, Filter,
    Bookmark, ChevronDown, X, Star
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

// Types
type SortOption = "title" | "author" | "dateAdded" | "lastRead";
type SortDirection = "asc" | "desc";
type ViewMode = "grid" | "list";
type BookProgress = {
    bookId: string;
    percentComplete: number;
    currentPage: number;
    lastReadAt: string;
};

export default function FavoritesPage() {
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [booksLoading, setBooksLoading] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("dateAdded");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [showProgressBar, setShowProgressBar] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

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
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return data.data.data as Book[];
        },
        enabled: !!user?.id && !!accessToken,
    });

    // Fetch book progress
    const { data: bookProgress } = useQuery({
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
            return data.data as BookProgress[];
        },
        enabled: !!user?.id && !!accessToken,
    });

    // Toggle favorite status mutation
    const toggleFavoriteMutation = useMutation({
        mutationFn: async (bookId: string) => {
            const book = favoriteBooks?.find(b => b.id === bookId);
            if (!book) return null;
            
            return apiFetch(
                "PATCH /book/:id",
                {
                    params: { id: bookId },
                    body: { liked: !book.liked }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["favoriteBooks"] });
        }
    });

    // Extract all unique genres from books
    const allGenres = favoriteBooks
        ? [...new Set(favoriteBooks.flatMap(book => {
            if (!book.genres) return [];
            return book.genres.map(genre => 
                typeof genre === 'string' 
                    ? genre 
                    : (genre as any).name || 'Unknown'
            );
          }).filter(Boolean))]
        : [];

    // Helper function to get book progress
    const getBookProgress = (bookId: string) => {
        if (!bookProgress) return null;
        return bookProgress.find(p => p.bookId === bookId);
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Filter and sort books
    const processedBooks = favoriteBooks
        ? favoriteBooks
            // Apply search filter
            .filter(book => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    (book.genres && book.genres.some(genre => {
                        const genreName = typeof genre === 'string' 
                            ? genre 
                            : (genre as any).name || '';
                        return genreName.toLowerCase().includes(query);
                    }))
                );
            })
            // Apply genre filter
            .filter(book => {
                if (!activeGenre) return true;
                return book.genres && book.genres.some(genre => {
                    const genreName = typeof genre === 'string' 
                        ? genre 
                        : (genre as any).name || '';
                    return genreName === activeGenre;
                });
            })
            // Sort books
            .sort((a, b) => {
                let comparison = 0;
                switch (sortBy) {
                    case "title":
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case "author":
                        comparison = a.author.localeCompare(b.author);
                        break;
                    case "dateAdded":
                        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
                        break;
                    case "lastRead":
                        const progressA = getBookProgress(a.id);
                        const progressB = getBookProgress(b.id);
                        const timeA = progressA?.lastReadAt ? new Date(progressA.lastReadAt).getTime() : 0;
                        const timeB = progressB?.lastReadAt ? new Date(progressB.lastReadAt).getTime() : 0;
                        comparison = timeA - timeB;
                        break;
                }
                return sortDirection === "asc" ? comparison : -comparison;
            })
        : [];

    // Handle book click to navigate to reading page
    const handleBookClick = (bookId: string) => {
        navigate(`/book?id=${bookId}`);
    };

    // Handle toggling a book's favorite status
    const handleToggleFavorite = (e: React.MouseEvent, bookId: string) => {
        e.stopPropagation();
        toggleFavoriteMutation.mutate(bookId);
    };

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
                            <Heart className={cn(
                                "mr-3 h-7 w-7",
                                isDarkMode ? "text-red-500" : "text-red-600"
                            )} />
                            <h1 className="text-2xl font-serif font-medium">My Favorites</h1>
                        </div>
                        
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    isDarkMode ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : ""
                                )}
                                onClick={() => setShowProgressBar(!showProgressBar)}
                            >
                                {showProgressBar ? "Hide Progress" : "Show Progress"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                className={cn(
                                    "pl-10 py-6",
                                    isDarkMode 
                                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                        : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                                )}
                                placeholder="Search favorites by title, author, or genre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            )}
                        </div>
                        
                        <div className="flex gap-2 flex-wrap md:flex-nowrap">
                            {/* Genre filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className={cn(
                                            "flex items-center whitespace-nowrap",
                                            isDarkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "",
                                            activeGenre ? (isDarkMode ? "border-amber-600" : "border-amber-600") : ""
                                        )}
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        {activeGenre || "All Genres"}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                                    <DropdownMenuItem 
                                        onClick={() => setActiveGenre(null)}
                                        className={cn(
                                            !activeGenre ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                                            isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                                        )}
                                    >
                                        All Genres
                                    </DropdownMenuItem>
                                    {allGenres.map(genre => (
                                        <DropdownMenuItem 
                                            key={genre} 
                                            onClick={() => setActiveGenre(genre)}
                                            className={cn(
                                                activeGenre === genre ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                                                isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                                            )}
                                        >
                                            {genre}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Sort dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className={cn(
                                            "whitespace-nowrap",
                                            isDarkMode ? "bg-gray-800 border-gray-700 text-gray-300" : ""
                                        )}
                                    >
                                        {sortDirection === "asc" ? (
                                            <SortAsc className="mr-2 h-4 w-4" />
                                        ) : (
                                            <SortDesc className="mr-2 h-4 w-4" />
                                        )}
                                        Sort by
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                                    <DropdownMenuItem 
                                        onClick={() => setSortBy("title")}
                                        className={cn(
                                            sortBy === "title" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                                            isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                                        )}
                                    >
                                        Title
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setSortBy("author")}
                                        className={cn(
                                            sortBy === "author" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                                            isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                                        )}
                                    >
                                        Author
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setSortBy("dateAdded")}
                                        className={cn(
                                            sortBy === "dateAdded" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                                            isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                                        )}
                                    >
                                        Date Added
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setSortBy("lastRead")}
                                        className={cn(
                                            sortBy === "lastRead" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                                            isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                                        )}
                                    >
                                        Last Read
                                    </DropdownMenuItem>
                                    <Separator className={isDarkMode ? "bg-gray-700" : ""} />
                                    <DropdownMenuItem 
                                        onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                                        className={isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""}
                                    >
                                        {sortDirection === "asc" ? (
                                            <SortDesc className="mr-2 h-4 w-4" />
                                        ) : (
                                            <SortAsc className="mr-2 h-4 w-4" />
                                        )}
                                        {sortDirection === "asc" ? "Descending" : "Ascending"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* View toggle */}
                            <div className="flex bg-gray-100 rounded-md p-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                        "p-1",
                                        viewMode === "grid" 
                                            ? (isDarkMode ? "bg-gray-700 text-white" : "bg-white shadow-sm")
                                            : (isDarkMode ? "text-gray-400" : "text-gray-500")
                                    )}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                        "p-1",
                                        viewMode === "list" 
                                            ? (isDarkMode ? "bg-gray-700 text-white" : "bg-white shadow-sm")
                                            : (isDarkMode ? "text-gray-400" : "text-gray-500")
                                    )}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {[...Array(10)].map((_, i) => (
                                    <Card key={i} className={cn(
                                        "overflow-hidden h-80 relative group animate-pulse",
                                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                                    )}>
                                        <div className="h-64 bg-gray-700"></div>
                                        <CardContent className="p-3">
                                            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={cn(
                                        "flex animate-pulse p-4 rounded-lg",
                                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                                    )}>
                                        <div className="w-16 h-24 bg-gray-700 rounded"></div>
                                        <div className="ml-4 flex-1">
                                            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                                            <div className="h-3 bg-gray-700 rounded w-1/6 mb-4"></div>
                                            <div className="h-2 bg-gray-700 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : processedBooks && processedBooks.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {processedBooks.map((book) => (
                                    <Card 
                                        key={book.id} 
                                        className={cn(
                                            "overflow-hidden h-80 relative group cursor-pointer",
                                            isDarkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50",
                                            booksLoading.includes(book.id) ? "opacity-50" : "opacity-100"
                                        )}
                                        onClick={() => handleBookClick(book.id)}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button 
                                                        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white text-red-500"
                                                        onClick={(e) => handleToggleFavorite(e, book.id)}
                                                    >
                                                        <Heart className="h-5 w-5 fill-red-500" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Remove from favorites</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        
                                        <div 
                                            className="h-56 bg-cover bg-center"
                                            style={{
                                                backgroundImage: book.imageUrl 
                                                    ? `url(${book.imageUrl})` 
                                                    : "url('/placeholder-book.jpg')"
                                            }}
                                        >
                                            <div className={cn(
                                                "w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                                isDarkMode ? "bg-black/60" : "bg-white/60"
                                            )}>
                                                <Button 
                                                    className={cn(
                                                        "transition-all",
                                                        isDarkMode ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-600 hover:bg-amber-700"
                                                    )}
                                                >
                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                    Read Book
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <CardContent className="p-3">
                                            <h3 className={cn(
                                                "font-medium text-sm line-clamp-1",
                                                isDarkMode ? "text-gray-200" : "text-gray-900"
                                            )}>
                                                {book.title}
                                            </h3>
                                            <p className={cn(
                                                "text-xs line-clamp-1",
                                                isDarkMode ? "text-gray-400" : "text-gray-500"
                                            )}>
                                                {book.author}
                                            </p>
                                            
                                            {showProgressBar && (
                                                <div className="mt-2">
                                                    {getBookProgress(book.id) ? (
                                                        <div className="space-y-1">
                                                            <Progress
                                                                value={getBookProgress(book.id)?.percentComplete ? getBookProgress(book.id)!.percentComplete * 100 : 0}
                                                                className={cn(
                                                                    "h-1.5",
                                                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                                )}
                                                                indicatorClassName="bg-amber-500"
                                                            />
                                                            <div className="flex justify-between">
                                                                <span className={cn(
                                                                    "text-xs",
                                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                                )}>
                                                                    {Math.round((getBookProgress(book.id)?.percentComplete || 0) * 100)}%
                                                                </span>
                                                                <span className={cn(
                                                                    "text-xs",
                                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                                )}>
                                                                    Page {getBookProgress(book.id)?.currentPage || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className={cn(
                                                            "text-xs italic mt-2",
                                                            isDarkMode ? "text-gray-500" : "text-gray-400"
                                                        )}>
                                                            Not started yet
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {book.genres && book.genres.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {book.genres.slice(0, 2).map((genre, index) => {
                                                        const genreName = typeof genre === 'string' 
                                                            ? genre 
                                                            : (genre as any).name || 'Unknown';
                                                        
                                                        return (
                                                            <Badge 
                                                                key={index} 
                                                                variant="secondary"
                                                                className={cn(
                                                                    "text-xs px-1.5 py-0",
                                                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                                )}
                                                            >
                                                                {genreName}
                                                            </Badge>
                                                        );
                                                    })}
                                                    {book.genres.length > 2 && (
                                                        <Badge 
                                                            variant="secondary"
                                                            className={cn(
                                                                "text-xs px-1.5 py-0",
                                                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                            )}
                                                        >
                                                            +{book.genres.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {processedBooks.map((book) => (
                                    <div 
                                        key={book.id}
                                        className={cn(
                                            "flex rounded-lg overflow-hidden cursor-pointer",
                                            isDarkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50",
                                            booksLoading.includes(book.id) ? "opacity-50" : "opacity-100"
                                        )}
                                        onClick={() => handleBookClick(book.id)}
                                    >
                                        <div 
                                            className="w-20 h-28 bg-cover bg-center flex-shrink-0"
                                            style={{
                                                backgroundImage: book.imageUrl 
                                                    ? `url(${book.imageUrl})` 
                                                    : "url('/placeholder-book.jpg')"
                                            }}
                                        ></div>
                                        
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={cn(
                                                        "font-medium",
                                                        isDarkMode ? "text-gray-200" : "text-gray-900"
                                                    )}>
                                                        {book.title}
                                                    </h3>
                                                    <p className={cn(
                                                        "text-sm",
                                                        isDarkMode ? "text-gray-400" : "text-gray-500"
                                                    )}>
                                                        {book.author}
                                                    </p>
                                                </div>
                                                
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button 
                                                                className="text-red-500 p-1"
                                                                onClick={(e) => handleToggleFavorite(e, book.id)}
                                                            >
                                                                <Heart className="h-5 w-5 fill-red-500" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Remove from favorites</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            
                                            {book.genres && book.genres.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {book.genres.map((genre, index) => {
                                                        const genreName = typeof genre === 'string' 
                                                            ? genre 
                                                            : (genre as any).name || 'Unknown';
                                                        
                                                        return (
                                                            <Badge 
                                                                key={index} 
                                                                variant="secondary"
                                                                className={cn(
                                                                    "text-xs px-1.5 py-0",
                                                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                                )}
                                                            >
                                                                {genreName}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            
                                            {showProgressBar && (
                                                <div className="mt-auto pt-3">
                                                    {getBookProgress(book.id) ? (
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between">
                                                                <span className={cn(
                                                                    "text-xs",
                                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                                )}>
                                                                    Progress: {Math.round((getBookProgress(book.id)?.percentComplete || 0) * 100)}%
                                                                </span>
                                                                <span className={cn(
                                                                    "text-xs",
                                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                                )}>
                                                                    Last read: {getBookProgress(book.id)?.lastReadAt ? formatDate(getBookProgress(book.id)?.lastReadAt!) : 'Never'}
                                                                </span>
                                                            </div>
                                                            <Progress
                                                                value={getBookProgress(book.id)?.percentComplete ? getBookProgress(book.id)!.percentComplete * 100 : 0}
                                                                className={cn(
                                                                    "h-1.5",
                                                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                                )}
                                                                indicatorClassName="bg-amber-500"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className={cn(
                                                            "text-xs italic",
                                                            isDarkMode ? "text-gray-500" : "text-gray-400"
                                                        )}>
                                                            Not started yet
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className={cn(
                            "flex flex-col items-center justify-center py-16 px-4 text-center",
                            isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50",
                            "rounded-lg border",
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                        )}>
                            <Heart className={cn(
                                "h-16 w-16 mb-4",
                                isDarkMode ? "text-gray-700" : "text-gray-300"
                            )} />
                            <h3 className={cn(
                                "text-xl font-serif font-medium mb-2",
                                isDarkMode ? "text-white" : "text-gray-800"
                            )}>
                                {activeGenre || searchQuery ? "No matching favorites found" : "No favorite books yet"}
                            </h3>
                            <p className={cn(
                                "mb-6 max-w-md mx-auto",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}>
                                {activeGenre || searchQuery ? 
                                    "Try changing your filters or search query to see more books." : 
                                    "You haven't added any books to your favorites. Click the heart icon on any book to add it to your favorites."}
                            </p>
                            <Button
                                onClick={() => {
                                    if (activeGenre || searchQuery) {
                                        setActiveGenre(null);
                                        setSearchQuery("");
                                    } else {
                                        navigate('/');
                                    }
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                {activeGenre || searchQuery ? (
                                    <>
                                        <X className="mr-2 h-4 w-4" />
                                        Clear Filters
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Browse Library
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 