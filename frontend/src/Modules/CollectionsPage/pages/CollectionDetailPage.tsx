import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../../atoms/themeAtom";
import { useAuth } from "../../../hooks/userAuth";
import { cn } from "../../../lib/utils";
import { 
  fetchCollectionById, 
  removeBookFromCollection,
  updateCollection,
  deleteCollection,
  addBookToCollection
} from "../../../api/collectionsApi";
import { Book } from "../../../endPointTypes/types";
import { apiFetch } from "../../../endPointTypes/apiClient";
import { 
  FolderHeart, 
  ChevronLeft, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Grid, 
  List,
  BookOpen,
  X,
  Clock,
  Search,
  Plus
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../../components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Separator } from "../../../components/ui/separator";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Card, CardContent } from "../../../components/ui/card";
import CollectionForm from "../components/CollectionForm";
import { formatDistance, formatDistanceToNow } from "date-fns";
import Sidebar from "../../LibraryPage/Sidebar";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRemoveBookDialog, setShowRemoveBookDialog] = useState(false);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  // Fetch collection data
  const { data: collectionData, isLoading } = useQuery({
    queryKey: ["collection", id],
    queryFn: () => fetchCollectionById(id!, accessToken!),
    enabled: !!id && !!accessToken,
  });

  const collection = collectionData?.success ? collectionData.data : null;

  // Fetch available books for adding to collection
  const fetchAvailableBooks = async () => {
    try {
      const response = await apiFetch(
        "GET /book/getUserBooks",
        { query: { userId: user?.id } },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
      // Filter out books already in the collection
      if (response.data && collection?.books) {
        const collectionBookIds = collection.books.map(book => book.id);
        return response.data.filter((book: Book) => !collectionBookIds.includes(book.id));
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching available books:", error);
      return [];
    }
  };

  useEffect(() => {
    if (showAddBookDialog) {
      fetchAvailableBooks().then(setAvailableBooks);
    }
  }, [showAddBookDialog, collection]);

  // Update collection mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateCollection(id!, data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
      setShowEditDialog(false);
    },
    onError: (error) => {
      setError("Failed to update collection");
      console.error("Update error:", error);
    }
  });

  // Delete collection mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteCollection(id!, accessToken!),
    onSuccess: () => {
      navigate("/collections");
    },
    onError: (error) => {
      setError("Failed to delete collection");
      console.error("Delete error:", error);
    }
  });

  // Remove book from collection mutation
  const removeBookMutation = useMutation({
    mutationFn: (bookId: string) => removeBookFromCollection(id!, bookId, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
      setShowRemoveBookDialog(false);
      setSelectedBookId(null);
    },
    onError: (error) => {
      setError("Failed to remove book from collection");
      console.error("Remove book error:", error);
    }
  });

  // Add book to collection mutation
  const addBookMutation = useMutation({
    mutationFn: (bookId: string) => addBookToCollection(id!, bookId, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
      setShowAddBookDialog(false);
    },
    onError: (error) => {
      setError("Failed to add book to collection");
      console.error("Add book error:", error);
    }
  });

  // Filter books by search query
  const filteredBooks = collection?.books?.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Filter available books by search query
  const filteredAvailableBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <Sidebar />
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-full max-w-2xl mb-8"></div>
        <div className="flex justify-between mb-6">
          <div className="h-10 w-64 bg-gray-200 rounded"></div>
          <div className="flex space-x-2">
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg border overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={cn(
          "p-6 rounded-lg border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <h2 className={cn(
            "text-xl font-bold mb-4",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Collection not found
          </h2>
          <p className={cn(
            "mb-6",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            The collection you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button
            onClick={() => navigate('/collections')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  const handleOpenRemoveDialog = (bookId: string) => {
    setSelectedBookId(bookId);
    setShowRemoveBookDialog(true);
  };

  const handleRemoveBook = () => {
    if (selectedBookId) {
      removeBookMutation.mutate(selectedBookId);
    }
  };

  const handleAddBook = (bookId: string) => {
    addBookMutation.mutate(bookId);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className={cn(
      "min-h-screen pb-10",
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    )}>
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "mr-4",
              isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : ""
            )}
            onClick={() => navigate('/collections')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{collection.name}</h1>
            {collection.description && (
              <p className={cn(
                "mt-1 text-sm sm:text-base",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                {collection.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : ""}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <DropdownMenuItem 
                onClick={() => setShowEditDialog(true)}
                className={isDarkMode ? "text-gray-200 focus:bg-gray-700" : ""}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Collection
              </DropdownMenuItem>
              <DropdownMenuSeparator className={isDarkMode ? "bg-gray-700" : ""} />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className={cn(
                  "text-red-600 focus:text-red-600",
                  isDarkMode ? "focus:bg-gray-700" : ""
                )}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Books count and creation date */}
        <div className={cn(
          "mb-6 text-sm flex items-center",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="mr-4">{filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>Created {formatDate(collection.createdAt)}</span>
        </div>

        {/* Action bar with search, view toggle and add book button */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
          <div className="relative">
            <Input
              placeholder="Search books in this collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 w-full sm:w-64",
                isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
              )}
            />
            <Search className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )} />
          </div>
          
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className={cn(
              "rounded-md border flex p-1",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
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
            
            {/* Add book button */}
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => setShowAddBookDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Books
            </Button>
          </div>
        </div>
        
        {/* Empty state */}
        {filteredBooks.length === 0 && (
          <div className={cn(
            "text-center py-12 px-4 rounded-lg border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <BookOpen className={cn(
              "h-12 w-12 mx-auto mb-4",
              isDarkMode ? "text-gray-600" : "text-gray-300"
            )} />
            
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No books found</h3>
                <p className={cn(
                  "max-w-md mx-auto mb-6",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  No books match your search query. Try a different search term.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className={isDarkMode ? "border-gray-700 text-gray-300" : ""}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">This collection is empty</h3>
                <p className={cn(
                  "max-w-md mx-auto mb-6",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  Add books to this collection to organize your library.
                </p>
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => setShowAddBookDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Books
                </Button>
              </>
            )}
          </div>
        )}
        
        {/* Books grid/list view */}
        {filteredBooks.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredBooks.map(book => (
                  <Card key={book.id} className={cn(
                    "overflow-hidden transition-all hover:shadow-md",
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                  )}>
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200">
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-12 w-12 text-amber-600/60" />
                        </div>
                      )}
                    </div>
                    <CardContent className={cn(
                      "p-4 relative",
                      isDarkMode ? "text-gray-100" : ""
                    )}>
                      <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                      <p className={cn(
                        "text-sm line-clamp-1",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {book.author}
                      </p>
                      <div className={cn(
                        "text-xs mt-1",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        Added {formatDate(book.addedAt)}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "absolute top-2 right-2 h-8 w-8 rounded-full",
                          isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "hover:bg-gray-100"
                        )}
                        onClick={() => handleOpenRemoveDialog(book.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBooks.map(book => (
                  <div key={book.id} className={cn(
                    "flex items-center p-3 rounded-lg border",
                    isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
                  )}>
                    <div className="h-16 w-12 mr-4 overflow-hidden rounded">
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-amber-100 to-amber-200">
                          <BookOpen className="h-6 w-6 text-amber-600/60" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-semibold truncate",
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      )}>
                        {book.title}
                      </h3>
                      <p className={cn(
                        "text-sm truncate",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {book.author}
                      </p>
                    </div>
                    
                    <div className={cn(
                      "text-xs mr-4 whitespace-nowrap",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Added {formatDate(book.addedAt)}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-red-500 hover:text-red-600",
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-red-50"
                      )}
                      onClick={() => handleOpenRemoveDialog(book.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Collection Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-white" : ""}>Edit Collection</DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
              Update your collection details below.
            </DialogDescription>
          </DialogHeader>
          <CollectionForm
            collection={collection}
            onSubmit={updateMutation.mutate}
            onCancel={() => setShowEditDialog(false)}
            isSubmitting={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-white" : ""}>Delete Collection</DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <Alert className={cn(
              "bg-red-100 text-red-800 border-red-200",
              isDarkMode && "bg-red-900/20 border-red-800/30 text-red-400"
            )}>
              <AlertDescription>
                This will remove the collection but will not delete any books from your library.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex items-center space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className={isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Book Dialog */}
      <Dialog open={showRemoveBookDialog} onOpenChange={setShowRemoveBookDialog}>
        <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-white" : ""}>Remove Book</DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
              Are you sure you want to remove this book from the collection?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRemoveBookDialog(false)}
              className={isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveBook}
              disabled={removeBookMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {removeBookMutation.isPending ? "Removing..." : "Remove Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Book Dialog */}
      <Dialog open={showAddBookDialog} onOpenChange={setShowAddBookDialog}>
        <DialogContent className={cn(
          "max-w-3xl max-h-[90vh] overflow-hidden flex flex-col",
          isDarkMode ? "bg-gray-900 border-gray-700" : ""
        )}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-white" : ""}>Add Books to Collection</DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
              Select books from your library to add to this collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative mt-2 mb-4">
            <Input
              placeholder="Search your books..."
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              className={cn(
                "pl-10",
                isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
              )}
            />
            <Search className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )} />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredAvailableBooks.length === 0 ? (
              <div className={cn(
                "text-center py-8",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {bookSearchQuery ? "No books found matching your search." : "No books available to add."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAvailableBooks.map(book => (
                  <div key={book.id} className={cn(
                    "flex items-center p-3 rounded-lg border",
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                  )}>
                    <div className="h-16 w-12 mr-4 overflow-hidden rounded">
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-amber-100 to-amber-200">
                          <BookOpen className="h-6 w-6 text-amber-600/60" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-semibold truncate",
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      )}>
                        {book.title}
                      </h3>
                      <p className={cn(
                        "text-sm truncate",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {book.author}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleAddBook(book.id)}
                      disabled={addBookMutation.isPending}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddBookDialog(false)}
              className={isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
} 