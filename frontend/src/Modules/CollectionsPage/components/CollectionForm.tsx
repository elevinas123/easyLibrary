import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../../atoms/themeAtom";
import { cn } from "../../../lib/utils";
import { Collection, CollectionFormData } from "../../../api/collectionsApi";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

interface CollectionFormProps {
  collection?: Collection;
  onSubmit: (data: CollectionFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CollectionForm({ 
  collection, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: CollectionFormProps) {
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || "");
      setImageUrl(collection.imageUrl || "");
    }
  }, [collection]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = "Collection name is required";
    }
    
    // URL validation (optional field)
    if (imageUrl && !isValidUrl(imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className={isDarkMode ? "text-gray-200" : ""}>
          Collection Name *
        </Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Favorite Books"
          className={cn(
            errors.name && "border-red-500",
            isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
          )}
          maxLength={100}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className={isDarkMode ? "text-gray-200" : ""}>
          Description
        </Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of this collection"
          className={cn(
            isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
          )}
          rows={3}
          maxLength={500}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className={isDarkMode ? "text-gray-200" : ""}>
          Cover Image URL
        </Label>
        <Input 
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={cn(
            errors.imageUrl && "border-red-500",
            isDarkMode && "bg-gray-800 border-gray-700 text-gray-200"
          )}
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
        )}
        {imageUrl && !errors.imageUrl && (
          <div className="mt-2 rounded-md overflow-hidden border h-24 w-24">
            <img 
              src={imageUrl} 
              alt="Cover preview" 
              className="h-full w-full object-cover"
              onError={() => setErrors({...errors, imageUrl: "Invalid image URL"})}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSubmitting ? "Saving..." : (collection ? "Update Collection" : "Create Collection")}
        </Button>
      </div>
    </form>
  );
} 