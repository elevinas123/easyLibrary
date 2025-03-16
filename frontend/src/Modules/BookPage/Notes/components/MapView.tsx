import { Note } from "../types";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { motion } from "framer-motion";

type MapViewProps = {
    notes: Note[];
    isDarkMode: boolean;
    handleNoteClick: (note: Note) => void;
};

export const MapView = ({ notes, isDarkMode, handleNoteClick }: MapViewProps) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <div className={cn(
                "relative w-full h-full max-w-lg rounded-lg p-4",
                isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
            )}>
                <h3 className="text-sm font-medium mb-3 text-center">
                    Connection Map
                </h3>
                
                <div className="relative w-full h-[calc(100%-30px)]">
                    {notes.map((note, index) => {
                        // Create a visual representation of each note as a dot on the map
                        // Position is calculated based on the note's points
                        const x = note.points && note.points.length > 0 
                            ? ((note.points[0] + 1000) % 100) + "%"
                            : ((index * 13) % 80 + 10) + "%";
                            
                        const y = note.points && note.points.length > 1
                            ? ((note.points[1] + 1000) % 100) + "%"
                            : ((index * 17) % 80 + 10) + "%";
                            
                        return (
                            <motion.div
                                key={note.arrowId}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: x, top: y }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "rounded-full p-0 h-8 w-8 border-2",
                                        note.startType === "BookText" && note.endType === "StickyNote" 
                                            ? (isDarkMode ? "border-indigo-700 bg-indigo-900/50" : "border-indigo-200 bg-indigo-100")
                                            : note.startType === "StickyNote" && note.endType === "BookText"
                                                ? (isDarkMode ? "border-rose-700 bg-rose-900/50" : "border-rose-200 bg-rose-100")
                                                : note.startType === "BookText" && note.endType === "BookText"
                                                    ? (isDarkMode ? "border-emerald-700 bg-emerald-900/50" : "border-emerald-200 bg-emerald-100")
                                                    : (isDarkMode ? "border-amber-700 bg-amber-900/50" : "border-amber-200 bg-amber-100")
                                    )}
                                    onClick={() => handleNoteClick(note)}
                                >
                                    <ArrowLeftRight className="h-3.5 w-3.5" />
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
                
                <p className={cn(
                    "text-xs text-center absolute bottom-2 left-0 right-0",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                    Tap a node to navigate to the connection
                </p>
            </div>
        </div>
    );
}; 