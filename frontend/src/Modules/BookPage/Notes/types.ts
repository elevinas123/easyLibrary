import { CanvaElementSkeleton, Point, Highlight } from "../../../endPointTypes/types";
export type Note = {
    startElement: CanvaElementSkeleton | Highlight;
    endElement: CanvaElementSkeleton | Highlight;
    points: Point[];
    arrowId: string;
    startType: string;
    endType: string;
    createdAt?: Date;
};

export type NotesProps = {
    isDarkMode?: boolean;
};

export type ViewType = "card" | "timeline" | "map";

export type ConnectionType = 
    | "text-annotation" 
    | "note-reference" 
    | "text-connection" 
    | "note-note" 
    | "image-connection" 
    | "other" 
    | "all";

export type GroupedNotes = Record<string, Note[]>;
export type NoteCounts = Record<string, number>; 