import { Note, ConnectionType } from "./types";
import { cn } from "../../../lib/utils";

// Get element content based on type
export function getElementContent(element: any, type: string): string {
    if (!element) return "Unknown";
    if (type === "BookText") {
        return element.text || "Book Text";
    } else if (type === "StickyNote") {
        return element.content || "Sticky Note";
    } else if (type === "Image") {
        return "Image";
    }
    return "Unknown";
}

// Get connection type for filtering
export const getConnectionType = (startType: string, endType: string): ConnectionType => {
    if (startType === "BookText" && endType === "StickyNote") {
        return "text-annotation";
    } else if (startType === "StickyNote" && endType === "BookText") {
        return "note-reference";
    } else if (startType === "BookText" && endType === "BookText") {
        return "text-connection";
    } else if (startType === "StickyNote" && endType === "StickyNote") {
        return "note-note";
    } else if (startType === "Image" && (endType === "BookText" || endType === "StickyNote")) {
        return "image-connection";
    } else if ((startType === "BookText" || startType === "StickyNote") && endType === "Image") {
        return "image-connection";
    }
    return "other";
};

// Get connection color based on type
export const getConnectionTypeColor = (startType: string, endType: string, isDarkMode: boolean) => {
    const connectionType = getConnectionType(startType, endType);
    
    switch (connectionType) {
        case "text-annotation":
            return isDarkMode 
                ? "from-indigo-900 to-indigo-800 text-indigo-100 border-indigo-700" 
                : "from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200";
        case "note-reference":
            return isDarkMode 
                ? "from-rose-900 to-rose-800 text-rose-100 border-rose-700" 
                : "from-rose-50 to-rose-100 text-rose-700 border-rose-200";
        case "text-connection":
            return isDarkMode 
                ? "from-emerald-900 to-emerald-800 text-emerald-100 border-emerald-700" 
                : "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200";
        case "note-note":
            return isDarkMode 
                ? "from-amber-900 to-amber-800 text-amber-100 border-amber-700" 
                : "from-amber-50 to-amber-100 text-amber-700 border-amber-200";
        case "image-connection":
            return isDarkMode 
                ? "from-sky-900 to-sky-800 text-sky-100 border-sky-700" 
                : "from-sky-50 to-sky-100 text-sky-700 border-sky-200";
        default:
            return isDarkMode 
                ? "from-gray-800 to-gray-700 text-gray-200 border-gray-600" 
                : "from-gray-50 to-gray-100 text-gray-700 border-gray-200";
    }
};

// Get human-friendly connection label
export const getConnectionLabel = (startType: string, endType: string): string => {
    if (startType === "BookText" && endType === "StickyNote") {
        return "Text Annotation";
    } else if (startType === "StickyNote" && endType === "BookText") {
        return "Note Reference";
    } else if (startType === "BookText" && endType === "BookText") {
        return "Text Connection";
    } else if (startType === "StickyNote" && endType === "StickyNote") {
        return "Note-to-Note";
    } else if (startType === "Image" && endType === "BookText") {
        return "Image to Text";
    } else if (startType === "BookText" && endType === "Image") {
        return "Text to Image";
    } else if (startType === "Image" && endType === "StickyNote") {
        return "Image Annotation";
    }
    return `${startType} to ${endType}`;
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

// Animation for smooth scroll
export const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Group notes by date for timeline view
export const groupNotesByDate = (notes: Note[]): Record<string, Note[]> => {
    return notes.reduce((groups: Record<string, Note[]>, note) => {
        const date = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown Date';
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(note);
        return groups;
    }, {});
};

// Count notes by type
export const countNotesByType = (notes: Note[]): Record<string, number> => {
    return notes.reduce((counts: Record<string, number>, note) => {
        const type = getConnectionType(note.startType, note.endType);
        counts[type] = (counts[type] || 0) + 1;
        return counts;
    }, { "all": notes.length });
};

// Filter notes based on search query and active filter
export const filterNotes = (notes: Note[], searchQuery: string, activeFilter: string): Note[] => {
    return notes.filter(note => {
        const textMatch = searchQuery ? 
            (note.startText.toLowerCase().includes(searchQuery.toLowerCase()) || 
             note.endText.toLowerCase().includes(searchQuery.toLowerCase())) : 
            true;
            
        const typeMatch = activeFilter === "all" ? 
            true : 
            getConnectionType(note.startType, note.endType) === activeFilter;
            
        return textMatch && typeMatch;
    });
}; 