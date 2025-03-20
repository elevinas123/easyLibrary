import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
    arrowsAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    highlightsAtom,
    scaleAtom,
} from "../Konva/konvaAtoms";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { LayoutGrid, Clock, MapPin, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

// Import types and utilities
import { Note, NotesProps, ViewType } from "./types";
import { getElementContent, easeInOutCubic, filterNotes, countNotesByType } from "./utils";

// Import components
import { CardView } from "./components/CardView";
import { TimelineView } from "./components/TimelineView";
import { SearchFilter } from "./components/SearchFilter";
import { EmptyState } from "./components/EmptyState";

export const Notes = ({ isDarkMode = false }: NotesProps) => {
    const [arrows] = useAtom(arrowsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
    const [view, setView] = useState<ViewType>("card");
    const [highlightElements] = useAtom(highlightsAtom);
    const [scale] = useAtom(scaleAtom);
    useEffect(() => {
        console.log("notes", notes);
    }, [notes]);
    useEffect(() => {
        offsetPositionRef.current.x = offsetPosition.x
        offsetPositionRef.current.y = offsetPosition.y
    }, [offsetPosition]);
    
    // Extract text based on element type
    const getTextFromElement = (element: any, type: string): string => {
        if (!element) return "Unknown Element";
        
        if (type === "bookText" || type === "BookText") {
            // For highlights, use the highlighted text
            return element.highlightedText || "Highlighted Text";
        } else if (type === "text") {
            // For text elements, get the text content
            return element.textElement?.text || "Text Element";
        } else if (type === "rect" || type === "circle") {
            // For shapes, just show a placeholder
            return `${type.charAt(0).toUpperCase() + type.slice(1)} Shape`;
        } else {
            // Default case
            return "Unknown Element";
        }
    };
    
    // Process arrows to generate notes
    useEffect(() => {
        const validArrows = arrows.filter(
            (arrow) =>
                arrow.arrowElement.startId !== undefined &&
                arrow.arrowElement.endId !== undefined
        );

        const mappedNotes = validArrows.map((arrow) => {
            if (!arrow.arrowElement.startType || !arrow.arrowElement.endType) {
                throw new Error("Arrow does not have a start or end element");
            }
            let startElement: any = null;
            let endElement: any = null;
            if (arrow.arrowElement.startType === "bookText") {
                startElement = highlightElements.find(
                    (element) => element.id === arrow.arrowElement.startId
                );
            } else {
                startElement = canvasElements.find(
                    (element) => element.id === arrow.arrowElement.startId
                );
            }
            if (arrow.arrowElement.endType === "bookText") {
                console.log("from here arrow.arrowElement.endId", arrow.arrowElement.endId);
                console.log("from here highlightElements", highlightElements);
                endElement = highlightElements.find(
                    (element) => element.id === arrow.arrowElement.endId
                );

            } else {
                endElement = canvasElements.find(
                    (element) => element.id === arrow.arrowElement.endId
                );
            }
            
            // Get the appropriate text for start and end elements
            const startText = getTextFromElement(startElement, arrow.arrowElement.startType);
            const endText = getTextFromElement(endElement, arrow.arrowElement.endType);

            return {
                startElement,
                endElement,
                startText,
                endText,
                points: arrow.points,
                arrowId: arrow.id,
                startType: arrow.arrowElement.startType,
                endType: arrow.arrowElement.endType,
                createdAt: 'createdAt' in arrow ? arrow.createdAt : new Date(),
            };
        });

        setNotes(mappedNotes);
    }, [arrows, canvasElements]);
    
    const offsetPositionRef = useRef(offsetPosition);

    // Count notes by type for filtering
    const noteCounts = countNotesByType(notes);
    
    // Apply filtering based on search and filter
    const filteredNotes = filterNotes(notes, searchQuery, activeFilter);

    const smoothScroll = (
      targetX: number,
      targetY: number,
      duration: number
    ) => {
      const start = performance.now();
      const initialOffset = { ...offsetPositionRef.current };
      const deltaX = targetX - initialOffset.x;
      const deltaY = targetY - initialOffset.y;
        console.log("nou cia targetX", targetX);
        console.log("nou cia targetY", targetY);
        console.log("nou cia initialOffset.x", initialOffset.x);
        console.log("nou cia initialOffset.y", initialOffset.y);
      console.log("nou cia deltaX", deltaX);
      console.log("nou cia deltaY", deltaY);
      const animateScroll = (currentTime: number) => {
          console.log("offsetPositionRef.current", offsetPositionRef.current);
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        setOffsetPosition({
          x: initialOffset.x + deltaX * easeProgress,
          y: initialOffset.y + deltaY * easeProgress,
        });

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };
   
    // Handle note click to navigate on canvas
    const handleNoteClick = (note: Note) => {
        console.log("note singular", note);
        if (note.points && note.points.length >= 2) {
            const targetY = -note.points[0].y;
            offsetPositionRef.current.x = offsetPosition.x
            offsetPositionRef.current.y = offsetPosition.y

            smoothScroll((note.points[0].x + 30 )/ scale, (targetY + 200 )/scale, 500);
        }
    };

    // When view changes, close any expanded notes
    const handleViewChange = (newView: ViewType) => {
        setExpandedNote(null);
        setView(newView);
    };

    return (
        <div className={cn(
            "h-full flex flex-col",
            isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
        )}>
            {/* Header with title, count, and view options */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h2 className={cn(
                            "text-lg font-semibold",
                            isDarkMode ? "text-amber-300" : "text-amber-700"
                        )}>
                            Notes & Connections
                        </h2>
                        <Badge variant={isDarkMode ? "outline" : "secondary"} className="font-normal">
                            {notes.length} {notes.length === 1 ? 'Connection' : 'Connections'}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    Export connections
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Print view
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Group by type
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                
                {/* Search and filtering */}
                <SearchFilter 
                    isDarkMode={isDarkMode}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    noteCounts={noteCounts}
                />
            </div>
            
            {/* View selector tabs */}
            <div className="px-4 pb-2">
                <Tabs defaultValue="card" value={view} className="w-full" onValueChange={(v) => handleViewChange(v as ViewType)}>
                    <TabsList className={cn(
                        "grid grid-cols-3 w-full h-8",
                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                    )}>
                        <TabsTrigger 
                            value="card" 
                            className={cn(
                                "text-xs flex items-center gap-1",
                                isDarkMode ? "data-[state=active]:bg-gray-700" : "data-[state=active]:bg-white"
                            )}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span>Cards</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="timeline" 
                            className={cn(
                                "text-xs flex items-center gap-1",
                                isDarkMode ? "data-[state=active]:bg-gray-700" : "data-[state=active]:bg-white"
                            )}
                        >
                            <Clock className="h-3.5 w-3.5" />
                            <span>Timeline</span>
                        </TabsTrigger>
                       
                    </TabsList>
                </Tabs>
            </div>
            
            {/* Main content area */}
            <div className="flex-1 overflow-hidden">
                {filteredNotes.length > 0 ? (
                    <>
                        {view === 'card' && (
                            <CardView 
                                notes={filteredNotes} 
                                isDarkMode={isDarkMode} 
                                expandedNote={expandedNote} 
                                setExpandedNote={setExpandedNote} 
                                handleNoteClick={handleNoteClick} 
                            />
                        )}
                        
                        {view === 'timeline' && (
                            <TimelineView 
                                notes={filteredNotes} 
                                isDarkMode={isDarkMode} 
                                handleNoteClick={handleNoteClick} 
                            />
                        )}
                        
                        
                    </>
                ) : (
                    // Show empty state when no notes or all filtered out
                    <EmptyState isDarkMode={isDarkMode} />
                )}
            </div>
        </div>
    );
}; 