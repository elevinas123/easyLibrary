import { Point } from "../../../endPointTypes/types";

export type Note = {
    endText: string;
    startText: string;
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