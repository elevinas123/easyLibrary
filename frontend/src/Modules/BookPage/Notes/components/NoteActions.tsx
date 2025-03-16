import { Button } from "../../../../components/ui/button";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Note } from "../types";

type NoteActionsProps = {
    note: Note;
    isDarkMode: boolean;
    handleNoteClick: (note: Note) => void;
};

export const NoteActions = ({ note, isDarkMode, handleNoteClick }: NoteActionsProps) => {
    return (
        <>
            <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-7 px-2"
                onClick={(e) => {
                    e.stopPropagation();
                    handleNoteClick(note);
                }}
            >
                <ExternalLink className="h-3 w-3 mr-1" />
                Go to
            </Button>
            
            <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-7 px-2"
            >
                <Edit className="h-3 w-3 mr-1" />
                Edit
            </Button>
            
            <Button 
                size="sm" 
                variant="outline"
                className={cn(
                    "text-xs h-7 px-2",
                    isDarkMode ? "hover:bg-red-900/20 hover:text-red-400" : "hover:bg-red-50 hover:text-red-500"
                )}
            >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
            </Button>
        </>
    );
}; 