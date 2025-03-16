import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../../atoms/themeAtom";
import { useAuth } from "../../../hooks/userAuth";
import { cn } from "../../../lib/utils";
import { Book } from "../../../endPointTypes/types";
import { 
  MoreHorizontal, Edit, Trash2, Heart, FolderHeart, Plus, Check, X 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { 
  fetchUserCollections, 
  addBookToCollection, 
  createCollection, 
  CollectionFormData 
} from "../../../api/collectionsApi";

type BookActionsMenuProps = {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  isLoading?: boolean;
  className?: string;
};

export default function BookActionsMenu({ 
  book, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  isLoading,
  className 
}: BookActionsMenuProps) {
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user collections
  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchUserCollections(user?.id || "", accessToken || ""),
    enabled: !!user?.id && !!accessToken,
  });

  const collections = collectionsData?.success ? collectionsData.data : [];

  // Create collection mutation
  const createMutation = useMutation({
    mutationFn: (data: CollectionFormData) => createCollection(data, accessToken!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setShowCreateDialog(false);
      setNewCollectionName("");
      
      // If successful, add the book to the newly created collection
      if (data?.id) {
        addBookMutation.mutate(data.id);
      }
    },
    onError: (error) => {
      setError("Failed to create collection");
      console.error("Create error:", error);
    }
  });

  // Add book to collection mutation
  const addBookMutation = useMutation({
    mutationFn: (collectionId: string) => addBookToCollection(collectionId, book.id, accessToken!),
    onSuccess: (_, collectionId) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      // Find collection name for success message
      const collectionName = collections.find(c => c.id === collectionId)?.name || "collection";
      setSuccess(`Added to ${collectionName}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError("Failed to add book to collection");
      console.error("Add book error:", error);
    }
  });

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      createMutation.mutate({ name: newCollectionName.trim() });
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    addBookMutation.mutate(collectionId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full",
              isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "",
              className
            )}
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <DropdownMenuItem 
            onClick={onEdit}
            className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onToggleFavorite}
            className={cn(
              book.liked ? "text-amber-500 focus:text-amber-500" : "",
              isDarkMode ? "focus:bg-gray-700" : ""
            )}
          >
            <Heart className={cn("mr-2 h-4 w-4", book.liked && "fill-amber-500")} />
            {book.liked ? "Remove from Favorites" : "Add to Favorites"}
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}>
              <FolderHeart className="mr-2 h-4 w-4" />
              Add to Collection
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                {collections.length > 0 ? (
                  <>
                    {collections.map(collection => (
                      <DropdownMenuItem 
                        key={collection.id}
                        onClick={() => handleAddToCollection(collection.id)}
                        className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}
                      >
                        <FolderHeart className="mr-2 h-4 w-4" />
                        {collection.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className={isDarkMode ? "bg-gray-700" : ""} />
                  </>
                ) : null}
                <DropdownMenuItem 
                  onClick={() => setShowCreateDialog(true)}
                  className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Collection
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator className={isDarkMode ? "bg-gray-700" : ""} />
          
          <DropdownMenuItem 
            onClick={onDelete}
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
      
      {/* Create Collection Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-white" : ""}>Create New Collection</DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
              Create a new collection and add "{book.title}" to it.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateCollection} className="space-y-4 mt-2">
            <div>
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className={isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""}
                autoFocus
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className={isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!newCollectionName.trim() || createMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {createMutation.isPending ? "Creating..." : "Create & Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Success message */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg flex items-center">
          <Check className="h-4 w-4 mr-2" />
          {success}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg">
          {error}
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 text-white hover:bg-red-600 p-1 h-auto"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
} 