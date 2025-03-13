import { Button } from "../../components/ui/button";
import { ChaptersData } from "../../endPointTypes/types";
import { ChevronLeft, ChevronRight, ChevronDown, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

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
    // Track expanded chapters
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
    // Track if sidebar is expanded
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    
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
            if (allChapters[i].indentLevel !== undefined && 
                allChapters[i].indentLevel < chapter.indentLevel) {
                return allChapters[i].id;
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
        <div 
            className={cn(
                "flex flex-col bg-zinc-900 border-l border-gray-800 h-screen overflow-hidden",
                sidebarExpanded ? "w-80" : "w-12",
                "transition-all duration-300 ease-in-out"
            )}
        >
            <div className="border-b border-gray-800 flex flex-row h-14 w-full items-center justify-center">
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-400 hover:text-white h-8 w-8 flex-shrink-0"
                    onClick={toggleSidebar}
                    title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {sidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </Button>
                
                <div className={cn(
                    "flex-grow text-center transition-opacity duration-200 mr-8",
                    sidebarExpanded ? "opacity-100" : "opacity-0 invisible"
                )}>
                    <div className="text-sm font-medium text-gray-300">Contents</div>
                </div>
            </div>
            
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out flex-grow",
                sidebarExpanded ? "opacity-100" : "opacity-0 w-0"
            )}>
                {sidebarExpanded && (
                    <div className="p-5 overflow-y-auto custom-scrollbar h-full">
                        <ul className="space-y-3">
                            {chapters?.map((chapter, index) => {
                                const isVisible = isChapterVisible(chapter);
                                const hasChildChapters = hasChildren(chapter, chapters);
                                const isExpanded = expandedChapters[chapter.id];
                                
                                if (!isVisible && chapter.indentLevel && chapter.indentLevel > 0) {
                                    return null;
                                }
                                
                                return (
                                    <li key={index}>
                                        <div className="flex items-center">
                                            {hasChildChapters && (
                                                <button 
                                                    onClick={(e) => toggleChapter(chapter.id, e)}
                                                    className="mr-1 text-gray-400 hover:text-white focus:outline-none flex-shrink-0"
                                                >
                                                    {isExpanded ? 
                                                        <ChevronDown size={16} /> : 
                                                        <ChevronRight size={16} />
                                                    }
                                                </button>
                                            )}
                                            <div
                                                className={`text-sm py-1.5 transition-all duration-200 cursor-pointer truncate ${
                                                    currentChapterId === chapter.id 
                                                        ? "text-white font-medium" 
                                                        : "text-gray-400 hover:text-gray-200"
                                                }`}
                                                style={{
                                                    paddingLeft: `${(chapter.indentLevel ?? 0) * 16 + (hasChildChapters ? 0 : 20)}px`,
                                                }}
                                                onClick={() => handleChapterClick(chapter.id)}
                                            >
                                                {chapter.title}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
            
            <div className={cn(
                "flex flex-col items-center justify-center transition-opacity duration-300 py-4",
                !sidebarExpanded ? "opacity-100" : "opacity-0 invisible h-0"
            )}>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-400 hover:text-white h-8 w-8"
                    onClick={() => {
                        setSidebarExpanded(true);
                    }}
                    title="Expand Table of Contents"
                >
                    <BookOpen size={18} />
                </Button>
            </div>
        </div>
    );
}
