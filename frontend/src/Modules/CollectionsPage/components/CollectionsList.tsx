import { useState } from "react";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../../atoms/themeAtom";
import { cn } from "../../../lib/utils";
import { Collection } from "../../../api/collectionsApi";
import { FolderHeart, Grid, List, SortAsc, SortDesc } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import CollectionCard from "./CollectionCard";

type SortOption = "name" | "dateCreated" | "bookCount";
type SortDirection = "asc" | "desc";

interface CollectionsListProps {
  collections: Collection[];
  isLoading: boolean;
  onCreateCollection: () => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string) => void;
}

export default function CollectionsList({
  collections,
  isLoading,
  onCreateCollection,
  onEditCollection,
  onDeleteCollection
}: CollectionsListProps) {
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dateCreated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCollections = collections
    .filter(collection => 
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "dateCreated") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "bookCount") {
        comparison = (a.bookCount || 0) - (b.bookCount || 0);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="flex space-x-2">
            <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
        
        <div className={cn(
          "grid gap-4 animate-pulse",
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""
        )}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className={cn(
                "rounded-lg border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"
              )}
            >
              <div className="pb-[60%] relative bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="relative">
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 w-full sm:w-64",
              isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
            )}
          />
          <FolderHeart className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onCreateCollection}
            className={cn(
              "bg-amber-600 hover:bg-amber-700 text-white border-0"
            )}
          >
            Create Collection
          </Button>
          
          {/* Sort options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
                )}
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4 mr-1" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-1" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <DropdownMenuItem 
                onClick={() => setSortBy("name")}
                className={cn(
                  sortBy === "name" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                  isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                )}
              >
                Name
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("dateCreated")}
                className={cn(
                  sortBy === "dateCreated" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                  isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                )}
              >
                Date Created
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("bookCount")}
                className={cn(
                  sortBy === "bookCount" ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : "",
                  isDarkMode ? "text-gray-300 focus:bg-gray-700" : ""
                )}
              >
                Book Count
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
          <div className={cn(
            "rounded-md border flex p-1",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"
          )}>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "px-2 py-1 h-auto",
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
                "px-2 py-1 h-auto",
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

      {/* Empty state */}
      {filteredCollections.length === 0 && (
        <div className={cn(
          "flex flex-col items-center justify-center py-16 text-center",
          isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50",
          "rounded-lg border",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <FolderHeart className={cn(
            "h-16 w-16 mb-4",
            isDarkMode ? "text-gray-700" : "text-gray-300"
          )} />
          <h3 className={cn(
            "text-xl font-medium mb-2",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            {searchQuery ? "No collections found" : "No collections yet"}
          </h3>
          <p className={cn(
            "mb-6 max-w-md mx-auto",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            {searchQuery 
              ? "Try changing your search query to find your collections." 
              : "Create your first collection to organize your books in a way that makes sense to you."}
          </p>
          {!searchQuery && (
            <Button
              onClick={onCreateCollection}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Create Collection
            </Button>
          )}
        </div>
      )}

      {/* Collections grid/list */}
      {filteredCollections.length > 0 && (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={onEditCollection}
                onDelete={onDeleteCollection}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={onEditCollection}
                onDelete={onDeleteCollection}
                viewMode="list"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
} 