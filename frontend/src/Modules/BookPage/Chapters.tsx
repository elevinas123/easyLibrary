import { Button } from "../../components/ui/button";
import { ChaptersData } from "../../endPointTypes/types";
import { ChevronLeft, ChevronRight, ChevronDown, BookOpen, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

type ChaptersProps = {
    chapters: ChaptersData[] | undefined;
    handleChapterClick: (chapterId: string) => void;
    currentChapterId?: string;
};

export default function Chapters({
    chapters,
    handleChapterClick,
    currentChapterId,
}: ChaptersProps) {
    console.log("chapters", chapters);
    // Track expanded chapters
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
    // Track if sidebar is expanded
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    // Get current theme
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    
    // Group chapters by parent-child relationship
    const chapterTree = buildChapterTree(chapters || []);
    
    // Initialize with current chapter's path expanded
    useEffect(() => {
        if (currentChapterId && chapters) {
            const newExpandedState = {...expandedChapters};
            
            // Find the current chapter's ancestors and expand them
            const expandParents = (chapters: ChaptersData[], targetId: string) => {
                for (const chapter of chapters) {
                    if (chapter.id === targetId) {
                        return true;
                    }
                    
                    // If this chapter has children and the target is among them
                    if (chapter.indentLevel !== undefined && chapter.indentLevel < getChapterIndentLevel(targetId, chapters)) {
                        const possibleParent = chapters.some(ch => 
                            ch.id === targetId && 
                            ch.indentLevel !== undefined && 
                            chapter.indentLevel !== undefined &&
                            ch.indentLevel > chapter.indentLevel
                        );
                        
                        if (possibleParent) {
                            newExpandedState[chapter.id] = true;
                        }
                    }
                }
                return false;
            };
            
            expandParents(chapters, currentChapterId);
            setExpandedChapters(newExpandedState);
        }
    }, [currentChapterId, chapters]);
    
    // Toggle chapter expansion
    const toggleChapter = (chapterId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };
    
    // Toggle sidebar expansion
    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };
    
    // Check if a chapter has children
    const hasChildren = (chapter: ChaptersData, allChapters: ChaptersData[]) => {
        if (chapter.indentLevel === undefined) return false;
        
        const chapterIndex = allChapters.findIndex(ch => ch.id === chapter.id);
        if (chapterIndex === -1 || chapterIndex === allChapters.length - 1) return false;
        
        const nextChapter = allChapters[chapterIndex + 1];
        return nextChapter.indentLevel !== undefined && 
               nextChapter.indentLevel > chapter.indentLevel;
    };
    
    // Get chapter indent level by ID
    const getChapterIndentLevel = (chapterId: string, allChapters: ChaptersData[]) => {
        const chapter = allChapters.find(ch => ch.id === chapterId);
        return chapter?.indentLevel ?? 0;
    };
    
    // Build a hierarchical structure of chapters
    function buildChapterTree(chapters: ChaptersData[]) {
        return chapters.filter(chapter => {
            return !chapter.indentLevel || chapter.indentLevel === 0 || 
                  (expandedChapters[getParentChapterId(chapter, chapters) || ''] !== false);
        });
    }
    
    // Find parent chapter ID
    function getParentChapterId(chapter: ChaptersData, allChapters: ChaptersData[]): string | null {
        if (!chapter.indentLevel || chapter.indentLevel === 0) return null;
        
        const chapterIndex = allChapters.findIndex(ch => ch.id === chapter.id);
        if (chapterIndex === -1) return null;
        
        // Look backward to find the parent (with lower indent level)
        for (let i = chapterIndex - 1; i >= 0; i--) {
            if (allChapters[i]?.indentLevel !== undefined && 
                chapter.indentLevel !== undefined &&
                allChapters[i]?.indentLevel < chapter.indentLevel) {
                return allChapters[i]?.id;
            }
        }
        
        return null;
    }
    
    // Determine if a chapter should be visible based on parent expansion state
    const isChapterVisible = (chapter: ChaptersData) => {
        if (!chapter.indentLevel || chapter.indentLevel === 0) return true;
        
        const parentId = getParentChapterId(chapter, chapters || []);
        if (!parentId) return true;
        
        return !!expandedChapters[parentId];
    };

    return (
        <aside
            className={cn(
                "h-screen border-r pr-2  flex flex-col transition-all duration-300 border-l",
                isDarkMode 
                    ? "bg-gray-900 border-gray-800" 
                    : "bg-white border-gray-200",
                sidebarExpanded ? "w-64" : "w-16"
            )}
        >
            <div className="p-2">
                <Button
                    variant="ghost"
                    onClick={toggleSidebar}
                    className={cn(
                        "w-full justify-start p-2",
                        isDarkMode 
                            ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                            : "text-gray-600 hover:text-gray-900 hover:bg-amber-50"
                    )}
                >
                    {sidebarExpanded ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                    {sidebarExpanded && (
                        <span className="ml-2 transition-opacity duration-150 opacity-100">
                            Contents
                        </span>
                    )}
                </Button>
            </div>

            <ScrollArea className="flex-grow">
                <div className="space-y-1 p-2">
                    {sidebarExpanded && (
                        chapters?.map((chapter, index) => {
                            const isVisible = isChapterVisible(chapter);
                            const hasChildChapters = hasChildren(chapter, chapters);
                            const isExpanded = expandedChapters[chapter.id];
                            const isActive = currentChapterId === chapter.id;
                            const indentLevel = chapter.indentLevel ?? 0;
                                
                            if (!isVisible && indentLevel > 0) {
                                return null;
                            }

                            return (
                                <div key={index} className="relative">
                                    <div className="flex items-center">
                                        <div 
                                            style={{
                                                paddingLeft: `${indentLevel * 12}px`
                                            }}
                                            className="flex-grow flex items-center"
                                        >
                                            {hasChildChapters && (
                                                <button
                                                    onClick={(e) => toggleChapter(chapter.id, e)}
                                                    className={cn(
                                                        "mr-1.5 h-5 w-5 flex items-center justify-center flex-shrink-0 rounded",
                                                        isDarkMode 
                                                            ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                                    )}
                                                >
                                                    <ChevronDown
                                                        size={16}
                                                        className={cn(
                                                            "transition-transform duration-200",
                                                            !isExpanded && "-rotate-90"
                                                        )}
                                                    />
                                                </button>
                                            )}
                                            
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "justify-start flex-grow w-full text-left",
                                                    !hasChildChapters && "pl-6",
                                                    isActive && (isDarkMode 
                                                        ? "bg-gray-800 text-white" 
                                                        : "bg-amber-100 text-gray-900"),
                                                    !isActive && (isDarkMode 
                                                        ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                                                        : "text-gray-700 hover:text-gray-900 hover:bg-amber-50")
                                                )}
                                                onClick={() => handleChapterClick(chapter.id)}
                                            >
                                                <span className="truncate">{chapter.title}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>

            {!sidebarExpanded && (
                <TooltipProvider>
                    <div className="flex flex-col items-center py-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 mb-2",
                                        isDarkMode 
                                            ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                                            : "text-gray-600 hover:text-gray-900 hover:bg-amber-50"
                                    )}
                                    onClick={() => setSidebarExpanded(true)}
                                >
                                    <BookOpen size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Show Contents</TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            )}
        </aside>
    );
}
