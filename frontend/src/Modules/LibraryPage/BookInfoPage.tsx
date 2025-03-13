import { BookOpen, ChevronLeft, ChevronRight, Calendar, Tag, User, Clock, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book } from "../../endPointTypes/types";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";

type BookInfoPageProps = {
    infoOpen: boolean;
    selectedBook: Book | null | undefined;
    setInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDarkMode: boolean;
};

export default function BookInfoPage({
    infoOpen,
    selectedBook,
    setInfoOpen,
    isDarkMode,
}: BookInfoPageProps) {
    const navigate = useNavigate();
    const [contentVisible, setContentVisible] = useState(infoOpen);
    
    // Handle content visibility based on sidebar state
    useEffect(() => {
        if (!infoOpen) {
            setContentVisible(false);
        } else {
            // Small delay to ensure content appears after sidebar expands
            const timer = setTimeout(() => {
                setContentVisible(true);
            }, 150); // Half of the sidebar transition duration
            return () => clearTimeout(timer);
        }
    }, [infoOpen]);
    
    const startReading = () => {
        if (selectedBook) {
            navigate(`/book?id=${selectedBook.id}`);
        }
    };

    return (
        <aside
            className={cn(
                "transform transition-all duration-300 ease-in-out border-l h-screen",
                isDarkMode 
                    ? "bg-zinc-800 border-gray-700 text-gray-200" 
                    : "bg-white border-gray-200 text-gray-800",
                infoOpen ? "w-80" : "w-16"
            )}
        >
            <div className="h-full flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    {infoOpen && contentVisible && (
                        <h3 className={cn(
                            "text-sm font-medium",
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        )}>
                            Book Details
                        </h3>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-8 w-8",
                            isDarkMode 
                                ? "text-gray-400 hover:text-white" 
                                : "text-gray-600 hover:text-gray-900",
                            !infoOpen && "mx-auto"
                        )}
                        onClick={() => setInfoOpen(!infoOpen)}
                    >
                        {infoOpen ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                
                <div className="flex-1 overflow-auto">
                    {infoOpen && contentVisible ? (
                        selectedBook ? (
                            <div className="p-4 space-y-6">
                                <div className="relative">
                                    <div className="flex justify-center">
                                        <img
                                            src={selectedBook.imageUrl}
                                            alt={selectedBook.title}
                                            className="w-48 h-64 object-cover rounded-md shadow-md"
                                        />
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <Badge variant={isDarkMode ? "default" : "secondary"} className="font-normal">
                                            <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                                            Favorite
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h2 className={cn(
                                        "text-xl font-bold text-center",
                                        isDarkMode ? "text-white" : "text-gray-900"
                                    )}>
                                        {selectedBook.title}
                                    </h2>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <User className={cn(
                                                "h-4 w-4 mr-2 flex-shrink-0",
                                                isDarkMode ? "text-gray-400" : "text-gray-500"
                                            )} />
                                            <p className={cn(
                                                "text-sm",
                                                isDarkMode ? "text-gray-300" : "text-gray-700"
                                            )}>
                                                {selectedBook.author}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <Calendar className={cn(
                                                "h-4 w-4 mr-2 flex-shrink-0",
                                                isDarkMode ? "text-gray-400" : "text-gray-500"
                                            )} />
                                            <p className={cn(
                                                "text-sm",
                                                isDarkMode ? "text-gray-300" : "text-gray-700"
                                            )}>
                                                Added: {new Date(selectedBook.dateAdded).toLocaleDateString()}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <Clock className={cn(
                                                "h-4 w-4 mr-2 flex-shrink-0",
                                                isDarkMode ? "text-gray-400" : "text-gray-500"
                                            )} />
                                            <p className={cn(
                                                "text-sm",
                                                isDarkMode ? "text-gray-300" : "text-gray-700"
                                            )}>
                                                {selectedBook.totalPages || 0} pages
                                            </p>
                                        </div>
                                        
                                        {selectedBook.genres && selectedBook.genres.length > 0 && (
                                            <div className="flex items-start">
                                                <Tag className={cn(
                                                    "h-4 w-4 mr-2 mt-1 flex-shrink-0",
                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                )} />
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedBook.genres.map((genre, index) => (
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
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {selectedBook.description && (
                                        <div className="pt-2">
                                            <h3 className={cn(
                                                "text-sm font-medium mb-2",
                                                isDarkMode ? "text-gray-300" : "text-gray-700"
                                            )}>
                                                Description
                                            </h3>
                                            <p className={cn(
                                                "text-sm",
                                                isDarkMode ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {selectedBook.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="pt-4">
                                    <Button
                                        className="w-full"
                                        onClick={startReading}
                                        variant={isDarkMode ? "default" : "secondary"}
                                    >
                                        <BookOpen className="mr-2 h-4 w-4" /> 
                                        Start Reading
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-4">
                                <p className={cn(
                                    "text-center",
                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                )}>
                                    Select a book to view details
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center space-y-4"></div>
                    )}
                </div>
            </div>
        </aside>
    );
}
