import { Search, X, Filter } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { NoteCounts, ConnectionType } from "../types";

type SearchFilterProps = {
    isDarkMode: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    noteCounts: NoteCounts;
};

export const SearchFilter = ({ 
    isDarkMode, 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter,
    noteCounts
}: SearchFilterProps) => {
    return (
        <div className="flex items-center space-x-2">
            <div className={cn(
                "flex items-center px-2 h-8 rounded-md flex-1 border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
            )}>
                <Search className="h-4 w-4 opacity-50 mr-1" />
                <input 
                    type="text"
                    placeholder="Search connections..."
                    className={cn(
                        "bg-transparent border-none outline-none text-sm w-full",
                        isDarkMode ? "placeholder:text-gray-500" : "placeholder:text-gray-400"
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                        <X className="h-3 w-3 opacity-50" />
                    </button>
                )}
            </div>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant={isDarkMode ? "outline" : "secondary"} 
                        size="sm" 
                        className={cn(
                            "h-8 text-xs gap-1",
                            activeFilter !== "all" && (isDarkMode ? "border-amber-700" : "bg-amber-100 text-amber-900")
                        )}
                    >
                        <Filter className="h-3 w-3" />
                        {activeFilter !== "all" && (
                            <span className="capitalize">
                                {activeFilter.replace("-", " ")}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                        onClick={() => setActiveFilter("all")}
                        className="flex justify-between"
                    >
                        <span>All</span>
                        <Badge variant="outline" className="ml-2">{noteCounts.all || 0}</Badge>
                    </DropdownMenuItem>
                    {["text-annotation", "note-reference", "text-connection", "note-note", "image-connection"].map(type => (
                        noteCounts[type] > 0 && (
                            <DropdownMenuItem 
                                key={type}
                                onClick={() => setActiveFilter(type)}
                                className="flex justify-between"
                            >
                                <span className="capitalize">{type.replace("-", " ")}</span>
                                <Badge variant="outline" className="ml-2">{noteCounts[type] || 0}</Badge>
                            </DropdownMenuItem>
                        )
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}; 