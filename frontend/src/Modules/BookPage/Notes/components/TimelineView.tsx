import { Note } from "../types";
import { ArrowLeftRight, Clock, ExternalLink } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
    getConnectionLabel, 
    getConnectionTypeColor, 
    truncateText,
    groupNotesByDate 
} from "../utils";

type TimelineViewProps = {
    notes: Note[];
    isDarkMode: boolean;
    handleNoteClick: (note: Note) => void;
};

export const TimelineView = ({ notes, isDarkMode, handleNoteClick }: TimelineViewProps) => {
    const groupedNotesByDate = groupNotesByDate(notes);
    
    // Get appropriate icon for element type
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'BookText':
                return <div className={cn(
                    "w-3 h-3 rounded-sm", 
                    isDarkMode ? "bg-emerald-600" : "bg-emerald-400"
                )}></div>;
            case 'StickyNote':
                return <div className={cn(
                    "w-3 h-3 rounded-sm", 
                    isDarkMode ? "bg-amber-600" : "bg-amber-400"
                )}></div>;
            case 'Image':
                return <div className={cn(
                    "w-3 h-3 rounded-sm", 
                    isDarkMode ? "bg-sky-600" : "bg-sky-400"
                )}></div>;
            default:
                return <div className={cn(
                    "w-3 h-3 rounded-sm", 
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                )}></div>;
        }
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-3 relative">
                {/* Timeline central line */}
                <div className={cn(
                    "absolute left-[41px] top-8 bottom-4 w-0.5",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )}></div>
                
                {Object.entries(groupedNotesByDate).map(([date, dateNotes], dateIndex) => (
                    <div key={date} className="mb-6">
                        <div className="flex items-center mb-2">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center mr-5 z-10",
                                isDarkMode ? "bg-amber-700 text-amber-200" : "bg-amber-100 text-amber-700"
                            )}>
                                <Clock className="h-3 w-3" />
                            </div>
                            <h3 className={cn(
                                "text-sm font-medium",
                                isDarkMode ? "text-amber-300" : "text-amber-700"
                            )}>
                                {date}
                            </h3>
                        </div>
                        
                        <div className="space-y-2 ml-[42px]">
                            {dateNotes.map((note, noteIndex) => (
                                <motion.div
                                    key={note.arrowId}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: noteIndex * 0.05 }}
                                    className={cn(
                                        "rounded-md p-2 flex gap-3 cursor-pointer transition-colors",
                                        isDarkMode 
                                            ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" 
                                            : "bg-white hover:bg-gray-50 border border-gray-200",
                                    )}
                                    onClick={() => handleNoteClick(note)}
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-1",
                                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                    )}>
                                        <ArrowLeftRight className="h-3 w-3" />
                                    </div>
                                    
                                    <div>
                                        <div className={cn(
                                            "text-xs inline-block px-1.5 py-0.5 rounded mb-1",
                                            getConnectionTypeColor(note.startType, note.endType, isDarkMode)
                                        )}>
                                            {getConnectionLabel(note.startType, note.endType)}
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className={cn(
                                                "p-1 rounded", 
                                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                            )}>
                                                {getTypeIcon(note.startType)}
                                            </div>
                                            <span className="text-xs">to</span>
                                            <div className={cn(
                                                "p-1 rounded", 
                                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                            )}>
                                                {getTypeIcon(note.endType)}
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs mt-1 max-w-md">
                                            {truncateText(note.startText, 30)} 
                                            <span className="mx-1 opacity-50">→</span>
                                            {truncateText(note.endText, 30)}
                                        </p>
                                    </div>
                                    
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn(
                                            "h-6 w-6 rounded-full ml-auto flex-shrink-0",
                                            isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNoteClick(note);
                                        }}
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}; 