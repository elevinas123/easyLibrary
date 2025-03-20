import { BookOpen, Heart, MoreVertical, Trash2, Star, ExternalLink, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
} from "../../components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Book } from "../../endPointTypes/types";
import { cn } from "../../lib/utils";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { Badge } from "../../components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useAuth } from "../../hooks/userAuth";

type BookCardProps = {
    book: Book;
    deleteBook: (bookId: string) => Promise<void>;
    selectBook: (bookId: string) => void;
    isSelected?: boolean;
};

export default function BookCard({
    book,
    deleteBook,
    selectBook,
    isSelected = false,
}: BookCardProps) {
    const [isLiked, setIsLiked] = useState(book.liked || false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    const {accessToken} = useAuth();
    useEffect(() => {
        const updateBook = async () => {
            await fetch(`/api/book/${book.id}`, {
                method: "PATCH",
                body: JSON.stringify({ liked: isLiked }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
        };
        updateBook();
    }, [isLiked]);
    const handleGoToBook = () => {
        navigate(`/book?id=${book.id}`);
    };
    
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <TooltipProvider>
            <Card 
                className={cn(
                    "flex flex-col h-full transition-all duration-200 overflow-hidden group",
                    isDarkMode 
                        ? "bg-zinc-800 border-gray-700 hover:border-gray-600" 
                        : "bg-white border-gray-200 hover:border-gray-300",
                    isSelected && (isDarkMode 
                        ? "ring-2 ring-blue-500" 
                        : "ring-2 ring-blue-400")
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="relative overflow-hidden">
                    <img
                        src={book.imageUrl}
                        alt={book.title}
                        className={cn(
                            "w-full h-64 object-cover transition-all duration-300",
                            isHovering ? "scale-105 brightness-75" : "scale-100"
                        )}
                    />
                    
                    {/* Overlay with read button */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                        isHovering ? "opacity-100" : "opacity-0"
                    )}>
                        <Button 
                            className="w-3/4 shadow-lg" 
                            onClick={handleGoToBook}
                            variant={isDarkMode ? "default" : "secondary"}
                            size="sm"
                        >
                            <BookOpen className="mr-2 h-4 w-4" /> Read Now
                        </Button>
                    </div>
                    
                    {/* Top action buttons */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all",
                                        isLiked ? "text-red-400 hover:text-red-300" : "text-white hover:text-white",
                                        isHovering ? "opacity-100" : "opacity-0 sm:opacity-100"
                                    )}
                                    onClick={() => setIsLiked(!isLiked)}
                                >
                                    <Heart className={cn(
                                        "h-4 w-4",
                                        isLiked && "fill-current"
                                    )} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isLiked ? "Remove from favorites" : "Add to favorites"}
                            </TooltipContent>
                        </Tooltip>
                        
                        <DropdownMenu>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all",
                                                isHovering ? "opacity-100" : "opacity-0 sm:opacity-100"
                                            )}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    More options
                                </TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className={isDarkMode ? "bg-zinc-800 border-gray-700" : "bg-white"}>
                                <DropdownMenuItem 
                                    onClick={() => selectBook(book.id)}
                                    className={isDarkMode ? "hover:bg-zinc-700" : ""}
                                >
                                    <Info className="h-4 w-4 mr-2" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleGoToBook}
                                    className={isDarkMode ? "hover:bg-zinc-700" : ""}
                                >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Read Book
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => window.open(`/book?id=${book.id}`, "_blank")}
                                    className={isDarkMode ? "hover:bg-zinc-700" : ""}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open in New Tab
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className={cn(
                                        "text-red-500",
                                        isDarkMode ? "hover:bg-zinc-700" : ""
                                    )}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    {/* Badges */}
                    {isLiked && (
                        <div className="absolute top-2 left-2">
                            <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Favorite
                            </Badge>
                        </div>
                    )}
                </div>
                
                <CardContent className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                            <h3 className={cn(
                                "text-lg font-semibold line-clamp-1",
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                            )}>
                                {book.title}
                            </h3>
                            <p className={cn(
                                "text-sm line-clamp-1",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}>
                                {book.author}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-2">
                        <p className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                        )}>
                            Added: {formatDate(book.dateAdded)}
                        </p>
                        
                        {book.totalPages && (
                            <p className={cn(
                                "text-xs mt-1",
                                isDarkMode ? "text-gray-500" : "text-gray-500"
                            )}>
                                {book.totalPages} pages
                            </p>
                        )}
                    </div>
                    
                    {book.genres && book.genres.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            {book.genres.slice(0, 2).map((genre, index) => (
                                <span 
                                    key={index}
                                    className={cn(
                                        "text-xs px-2 py-0.5 rounded-full",
                                        isDarkMode 
                                            ? "bg-zinc-700 text-gray-300" 
                                            : "bg-gray-100 text-gray-700"
                                    )}
                                >
                                    {genre}
                                </span>
                            ))}
                            {book.genres.length > 2 && (
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    isDarkMode 
                                        ? "bg-zinc-700 text-gray-300" 
                                        : "bg-gray-100 text-gray-700"
                                )}>
                                    +{book.genres.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                    <div className="w-full flex gap-2">
                        <Button 
                            variant="outline"
                            onClick={() => selectBook(book.id)}
                            className={cn(
                                "flex-1",
                                isDarkMode 
                                    ? "border-gray-700 hover:bg-zinc-700 text-gray-300" 
                                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                            )}
                            size="sm"
                        >
                            <Info className="mr-2 h-4 w-4" />
                            Details
                        </Button>
                        
                        <Button 
                            onClick={handleGoToBook}
                            variant={isDarkMode ? "default" : "secondary"}
                            className="flex-1"
                            size="sm"
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read
                        </Button>
                    </div>
                </CardFooter>
                
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className={cn(
                        "max-w-md",
                        isDarkMode 
                            ? "bg-zinc-800 text-gray-100 border-gray-700" 
                            : "bg-white text-gray-800 border-gray-200"
                    )}>
                        <DialogHeader>
                            <DialogTitle className={cn(
                                "text-xl",
                                isDarkMode ? "text-gray-100" : "text-gray-900"
                            )}>
                                Delete "{book.title}"?
                            </DialogTitle>
                            <DialogDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                Are you sure you want to delete this book? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-6 flex justify-end space-x-3">
                            <DialogClose asChild>
                                <Button 
                                    variant="outline"
                                    className={isDarkMode 
                                        ? "border-gray-700 hover:bg-zinc-700 text-gray-300" 
                                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                    }
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    deleteBook(book.id);
                                    setIsDeleteDialogOpen(false);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </TooltipProvider>
    );
}
