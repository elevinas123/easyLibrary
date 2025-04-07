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
        
        </div>
    );
}; 