import { FolderHeart, MoreHorizontal, Edit, Trash2, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../../atoms/themeAtom";
import { cn } from "../../../lib/utils";
import { Collection } from "../../../api/collectionsApi";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
  viewMode?: "grid" | "list";
}

export default function CollectionCard({ 
  collection, 
  onEdit, 
  onDelete, 
  viewMode = "grid" 
}: CollectionCardProps) {
  const navigate = useNavigate();
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";

  const handleViewCollection = () => {
    navigate(`/collections/${collection.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  if (viewMode === "grid") {
    return (
      <div 
        className={cn(
          "rounded-lg border overflow-hidden transition-all hover:shadow-md",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white",
          "cursor-pointer group"
        )}
      >
        <div 
          className="relative pb-[60%] bg-gradient-to-br from-amber-100 to-amber-200"
          onClick={handleViewCollection}
        >
          {collection.imageUrl ? (
            <img 
              src={collection.imageUrl} 
              alt={collection.name}
              className="absolute w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderHeart className={cn(
                "h-16 w-16",
                isDarkMode ? "text-amber-500/30" : "text-amber-500/60"
              )} />
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity",
                    isDarkMode && "text-gray-800"
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(collection);
                  }}
                  className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkMode ? "bg-gray-700" : ""} />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(collection.id);
                  }}
                  className={cn(
                    "text-red-600 focus:text-red-600",
                    isDarkMode ? "focus:bg-gray-700" : ""
                  )}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div 
          className="p-3"
          onClick={handleViewCollection}
        >
          <h3 className={cn(
            "font-medium mb-1 truncate",
            isDarkMode ? "text-gray-100" : ""
          )}>
            {collection.name}
          </h3>
          
          {collection.description && (
            <p className={cn(
              "text-sm line-clamp-2 mb-2",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {collection.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {collection.bookCount || 0} {(collection.bookCount === 1) ? "book" : "books"}
            </span>
            <span className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {formatDate(collection.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    // List view
    return (
      <div 
        className={cn(
          "flex items-center p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer",
          isDarkMode 
            ? "bg-gray-800 border-gray-700 hover:border-amber-600/50" 
            : "hover:border-amber-500/50"
        )}
        onClick={handleViewCollection}
      >
        <div className={cn(
          "h-12 w-12 rounded-md flex items-center justify-center mr-3",
          isDarkMode ? "bg-gray-700" : "bg-amber-100"
        )}>
          {collection.imageUrl ? (
            <img 
              src={collection.imageUrl} 
              alt={collection.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <FolderHeart className={cn(
              "h-6 w-6",
              isDarkMode ? "text-amber-500/30" : "text-amber-500/50"
            )} />
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className={cn(
            "font-medium truncate",
            isDarkMode ? "text-gray-100" : ""
          )}>
            {collection.name}
          </h3>
          
          {collection.description && (
            <p className={cn(
              "text-sm truncate",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {collection.description}
            </p>
          )}
        </div>
        
        <div className={cn(
          "text-sm mr-4",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {collection.bookCount || 0} {(collection.bookCount === 1) ? "book" : "books"}
        </div>
        
        <div className={cn(
          "text-sm mr-4",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {formatDate(collection.createdAt)}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : ""
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(collection);
              }}
              className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className={isDarkMode ? "bg-gray-700" : ""} />
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(collection.id);
              }}
              className={cn(
                "text-red-600 focus:text-red-600",
                isDarkMode ? "focus:bg-gray-700" : ""
              )}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
} 