import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/userAuth";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../../atoms/themeAtom";
import { cn } from "../../../lib/utils";
import Sidebar from "../../LibraryPage/Sidebar";
import { 
  fetchUserCollections, 
  createCollection, 
  deleteCollection,
  updateCollection,
  Collection, 
  CollectionFormData 
} from "../../../api/collectionsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import CollectionsList from "../components/CollectionsList";
import CollectionForm from "../components/CollectionForm";

export default function CollectionsPage() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch collections
  const { data: collectionsData, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchUserCollections(user?.id || "", accessToken || ""),
    enabled: !!user?.id && !!accessToken,
  });

  const collections = collectionsData?.success ? collectionsData.data : [];

  // Create collection mutation
  const createMutation = useMutation({
    mutationFn: (data: CollectionFormData) => createCollection(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setShowCreateDialog(false);
    },
    onError: (error) => {
      setError("Failed to create collection");
      console.error("Create error:", error);
    }
  });

  // Update collection mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CollectionFormData }) => 
      updateCollection(id, data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setShowEditDialog(false);
      setCurrentCollection(null);
    },
    onError: (error) => {
      setError("Failed to update collection");
      console.error("Update error:", error);
    }
  });

  // Delete collection mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCollection(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setShowDeleteDialog(false);
      setCurrentCollection(null);
    },
    onError: (error) => {
      setError("Failed to delete collection");
      console.error("Delete error:", error);
    }
  });

  const handleCreateCollection = () => {
    setShowCreateDialog(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setCurrentCollection(collection);
    setShowEditDialog(true);
  };

  const handleDeleteCollection = (id: string) => {
    const collection = collections.find(c => c.id === id);
    if (collection) {
      setCurrentCollection(collection);
      setShowDeleteDialog(true);
    }
  };

  const handleUpdateCollection = (data: CollectionFormData) => {
    if (currentCollection) {
      updateMutation.mutate({ id: currentCollection.id, data });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className={cn(
        "flex-1 overflow-auto p-6",
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50"
      )}>
        <div className="container mx-auto">
          <h1 className={cn(
            "text-3xl font-bold mb-6",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Collections
          </h1>

          <CollectionsList 
            collections={collections}
            isLoading={isLoading}
            onCreateCollection={handleCreateCollection}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
          />
        </div>

        {/* Create Collection Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? "text-white" : ""}>Create Collection</DialogTitle>
              <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
                Create a new collection to organize your books.
              </DialogDescription>
            </DialogHeader>
            <CollectionForm
              onSubmit={createMutation.mutate}
              onCancel={() => setShowCreateDialog(false)}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Collection Dialog */}
        {currentCollection && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? "text-white" : ""}>Edit Collection</DialogTitle>
                <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
                  Update your collection details below.
                </DialogDescription>
              </DialogHeader>
              <CollectionForm
                collection={currentCollection}
                onSubmit={handleUpdateCollection}
                onCancel={() => setShowEditDialog(false)}
                isSubmitting={updateMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Collection Dialog */}
        {currentCollection && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className={isDarkMode ? "bg-gray-900 border-gray-700" : ""}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? "text-white" : ""}>Delete Collection</DialogTitle>
                <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
                  Are you sure you want to delete "{currentCollection.name}"? This action cannot be undone.
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
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className={cn(
                    "px-4 py-2 rounded-md",
                    isDarkMode 
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700" 
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  )}
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => deleteMutation.mutate(currentCollection.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Error message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg">
            {error}
            <button 
              className="ml-2 text-white hover:bg-red-600 p-1 rounded-full"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 