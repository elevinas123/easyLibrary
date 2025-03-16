import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
    arrowsAtom,
    canvaElementsAtom,
    offsetPositionAtom,
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
import { MapView } from "./components/MapView";
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
            const startElement = canvasElements.find(
                (element) => element.id === arrow.arrowElement.startId
            );
            const endElement = canvasElements.find(
                (element) => element.id === arrow.arrowElement.endId
            );
            
            const startText = getElementContent(
                startElement,
                arrow.arrowElement.startType
            );
            const endText = getElementContent(
                endElement,
                arrow.arrowElement.endType
            );

            return {
                startText,
                endText,
                points: arrow.points,
                arrowId: arrow.id,
                startType: arrow.arrowElement.startType,
                endType: arrow.arrowElement.endType,
                createdAt: arrow.createdAt || new Date(),
            };
        });

        setNotes(mappedNotes);
    }, [arrows, canvasElements]);

    // Count notes by type for filtering
    const noteCounts = countNotesByType(notes);
    
    // Apply filtering based on search and filter
    const filteredNotes = filterNotes(notes, searchQuery, activeFilter);

    // Smooth scroll to note position
    const smoothScroll = (
        targetX: number,
        targetY: number,
        duration: number
    ) => {
        const start = performance.now();
        const initialOffset = { ...offsetPosition };
        const deltaX = targetX - initialOffset.x;
        const deltaY = targetY - initialOffset.y;

        const animateScroll = (currentTime: number) => {
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
        if (note.points && note.points.length >= 2) {
            const targetY = -note.points[1];
            smoothScroll(-note.points[0] + 500, targetY + 300, 500);
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
                        <TabsTrigger 
                            value="map" 
                            className={cn(
                                "text-xs flex items-center gap-1",
                                isDarkMode ? "data-[state=active]:bg-gray-700" : "data-[state=active]:bg-white"
                            )}
                        >
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Map</span>
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
                        
                        {view === 'map' && (
                            <MapView 
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