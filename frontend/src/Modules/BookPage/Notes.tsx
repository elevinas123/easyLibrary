import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
    arrowsAtom,
    canvaElementsAtom,
    offsetPositionAtom,
} from "./Konva/konvaAtoms";

import {
    Card,
    CardContent,
} from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Point } from "../../endPointTypes/types";
import { ArrowLeftRight, Book, Image, Lightbulb, ArrowRight, Clock, StickyNote } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";

type Note = {
    endText: string;
    startText: string;
    points: Point[];
    arrowId: string;
    startType: string;
    endType: string;
    createdAt?: Date;
};

type NotesProps = {
    isDarkMode?: boolean;
};

export default function Notes({ isDarkMode = false }: NotesProps) {
    const [arrows] = useAtom(arrowsAtom);
    const [canvasElements] = useAtom(canvaElementsAtom);
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const [notes, setNotes] = useState<Note[]>([]);

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

    const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

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

    const handleNoteClick = (note: Note) => {
        if (note.points && note.points.length >= 2) {
            const targetY = -note.points[1];
            smoothScroll(-note.points[0] + 500, targetY + 300, 500);
        }
    };

    // Helper function to get content from elements
    function getElementContent(element: any, type: string): string {
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

    // Get appropriate icon for element type
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'BookText':
                return <Book className="h-4 w-4" />;
            case 'StickyNote':
                return <StickyNote className="h-4 w-4" />;
            case 'Image':
                return <Image className="h-4 w-4" />;
            default:
                return <Lightbulb className="h-4 w-4" />;
        }
    };

    const getConnectionTypeColor = (startType: string, endType: string) => {
        // Generate unique colors based on connection types
        if (startType === "BookText" && endType === "StickyNote") {
            return isDarkMode ? "bg-indigo-900 text-indigo-200" : "bg-indigo-100 text-indigo-700";
        } else if (startType === "StickyNote" && endType === "BookText") {
            return isDarkMode ? "bg-rose-900 text-rose-200" : "bg-rose-100 text-rose-700";
        } else if (startType === "BookText" && endType === "BookText") {
            return isDarkMode ? "bg-emerald-900 text-emerald-200" : "bg-emerald-100 text-emerald-700";
        } else if (startType === "StickyNote" && endType === "StickyNote") {
            return isDarkMode ? "bg-amber-900 text-amber-200" : "bg-amber-100 text-amber-700";
        } else if (startType === "Image" || endType === "Image") {
            return isDarkMode ? "bg-sky-900 text-sky-200" : "bg-sky-100 text-sky-700";
        }
        return isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700";
    };

    // Get short connection description
    const getConnectionLabel = (startType: string, endType: string) => {
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
    const truncateText = (text: string, maxLength: number = 60) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className={cn(
            "p-4 h-full",
            isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
        )}>
            <div className="flex items-center justify-between mb-4">
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
            
            {notes.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <Card
                                key={note.arrowId}
                                className={cn(
                                    "cursor-pointer transition-all duration-200 overflow-hidden border",
                                    isDarkMode ? 
                                        "bg-gray-800 border-gray-700 hover:bg-gray-750" : 
                                        "bg-white border-gray-200 hover:shadow-md",
                                )}
                                onClick={() => handleNoteClick(note)}
                            >
                                <div className={cn(
                                    "px-3 py-2 flex items-center justify-between",
                                    getConnectionTypeColor(note.startType, note.endType)
                                )}>
                                    <div className="flex items-center gap-1.5">
                                        <ArrowLeftRight className="h-3.5 w-3.5" />
                                        <span className="text-xs font-medium">
                                            {getConnectionLabel(note.startType, note.endType)}
                                        </span>
                                    </div>
                                    {note.createdAt && (
                                        <div className="flex items-center text-xs opacity-80">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                
                                <CardContent className={cn(
                                    "p-3",
                                    isDarkMode ? "text-gray-300" : "text-gray-700"
                                )}>
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className={cn(
                                                "p-1.5 rounded-md mt-0.5", 
                                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                            )}>
                                                {getTypeIcon(note.startType)}
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className={cn(
                                                    "text-xs mb-1 font-medium",
                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                )}>
                                                    {note.startType}
                                                </p>
                                                <p className="break-words">
                                                    {truncateText(note.startText)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-center">
                                            <div className={cn(
                                                "h-6 w-6 rounded-full flex items-center justify-center",
                                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                            )}>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                            <div className={cn(
                                                "p-1.5 rounded-md mt-0.5", 
                                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                            )}>
                                                {getTypeIcon(note.endType)}
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className={cn(
                                                    "text-xs mb-1 font-medium",
                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                )}>
                                                    {note.endType}
                                                </p>
                                                <p className="break-words">
                                                    {truncateText(note.endText)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className={cn(
                    "flex flex-col items-center justify-center h-[calc(100vh-180px)] space-y-3",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                    <ArrowLeftRight className="h-10 w-10 opacity-30" />
                    <div className="text-center space-y-1">
                        <p className="font-medium">No connections yet</p>
                        <p className="text-sm opacity-70">Create connections between text and notes to see them here</p>
                    </div>
                </div>
            )}
        </div>
    );
}
