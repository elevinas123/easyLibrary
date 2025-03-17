// RightHand.tsx

import { useState } from "react";
import Settings from "../Settings/Settings";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { ChevronLeft, ChevronRight, BookOpen, Settings as SettingsIcon, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { Notes } from "./Notes/Notes";

type RightHandProps = {
    sessionActive?: boolean;
    startTime?: Date | null;
    currentPage?: number;
    totalPages?: number;
    onEndSession?: () => void;
};

export default function RightHand({
    sessionActive = false,
    startTime = null,
    currentPage = 0,
    totalPages = 0,
    onEndSession
}: RightHandProps) {
    const [selected, setSelected] = useState<"notes" | "settings">("notes");
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    const calculateProgress = () => {
        if (totalPages === 0) return 0;
        return Math.min(100, Math.round((currentPage / totalPages) * 100));
    };

    const formatReadingTime = () => {
        if (!startTime) return "0 minutes";
        return formatDistanceToNow(startTime, { addSuffix: false });
    };

    return (
        <div 
            className={cn(
                "flex flex-col h-screen  transition-all duration-300 ease-in-out border-l",
                isDarkMode 
                    ? "bg-zinc-900 border-gray-800" 
                    : "bg-white border-gray-200",
                sidebarExpanded ? "w-80" : "w-12"
            )}
        >
            <div className={cn(
                "flex flex-row h-14 w-full items-center justify-center border-b",
                isDarkMode ? "border-gray-800" : "border-gray-200"
            )}>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                        "h-8 w-8 flex-shrink-0",
                        isDarkMode 
                            ? "text-gray-400 hover:text-white" 
                            : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={toggleSidebar}
                    title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {sidebarExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
                
                <div className={cn(
                    "flex-grow text-center transition-opacity duration-200 mr-8",
                    sidebarExpanded ? "opacity-100" : "opacity-0 invisible"
                )}>
                    <div className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-gray-300" : "text-gray-800"
                    )}>
                        Tools
                    </div>
                </div>
            </div>
            
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out flex-grow",
                sidebarExpanded ? "opacity-100" : "opacity-0 w-0"
            )}>
                {sidebarExpanded && (
                    <div className="flex flex-col h-full">
                        <Tabs
                            value={selected}
                            onValueChange={(value) =>
                                setSelected(value as "notes" | "settings")
                            }
                            className="flex flex-col h-full"
                        >
                            <TabsList className={cn(
                                "flex-shrink-0 p-1 mx-4 mt-4 rounded-md",
                                isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                            )}>
                                <TabsTrigger 
                                    value="notes" 
                                    className={cn(
                                        "flex-1",
                                        isDarkMode 
                                            ? "data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-gray-400" 
                                            : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                                    )}
                                >
                                    <FileText size={16} className="mr-2" />
                                    Notes
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="settings" 
                                    className={cn(
                                        "flex-1",
                                        isDarkMode 
                                            ? "data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-gray-400" 
                                            : "data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
                                    )}
                                >
                                    <SettingsIcon size={16} className="mr-2" />
                                    Settings
                                </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="notes" className="flex-grow overflow-auto p-4">
                                <Notes />
                            </TabsContent>
                            
                            <TabsContent value="settings" className="flex-grow overflow-auto p-4">
                                <Settings />
                            </TabsContent>
                        </Tabs>
                        
                        {/* Reading Session Info */}
                        {sessionActive && (
                            <div className={cn(
                                "p-4 border-t",
                                isDarkMode ? "border-gray-800" : "border-gray-200"
                            )}>
                                <Card className={cn(
                                    "border-0",
                                    isDarkMode 
                                        ? "bg-zinc-800 text-gray-300" 
                                        : "bg-gray-100 text-gray-800"
                                )}>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-1">
                                            <p className={isDarkMode ? "text-xs text-gray-400" : "text-xs text-gray-600 font-medium"}>
                                                Reading Time
                                            </p>
                                            <p className={cn(
                                                "text-sm font-medium",
                                                isDarkMode ? "text-white" : "text-gray-800"
                                            )}>
                                                {formatReadingTime()}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <p className={isDarkMode ? "text-xs text-gray-400" : "text-xs text-gray-600 font-medium"}>
                                                    Progress
                                                </p>
                                                <p className={isDarkMode ? "text-xs text-gray-400" : "text-xs text-gray-600 font-medium"}>
                                                    {currentPage} of {totalPages}
                                                </p>
                                            </div>
                                            <Progress 
                                                value={calculateProgress()} 
                                                className={cn(
                                                    "h-1.5",
                                                    isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                                                )}
                                                style={{
                                                    ["--progress-foreground" as any]: isDarkMode ? "#60a5fa" : "#3b82f6"
                                                }}
                                            />
                                        </div>
                                        
                                        <Button 
                                            variant={isDarkMode ? "outline" : "secondary"}
                                            size="sm"
                                            className={cn(
                                                "w-full text-xs",
                                                isDarkMode 
                                                    ? "border-gray-700 hover:bg-zinc-700 hover:text-white" 
                                                    : "text-gray-700 hover:text-gray-900"
                                            )}
                                            onClick={onEndSession}
                                        >
                                            End Reading Session
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className={cn(
                "flex flex-col items-center justify-center transition-opacity duration-300 py-4 gap-4",
                !sidebarExpanded ? "opacity-100" : "opacity-0 invisible h-0"
            )}>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                        "h-8 w-8",
                        isDarkMode 
                            ? "text-gray-400 hover:text-white" 
                            : "text-gray-600 hover:text-gray-900",
                        selected === "notes" && !sidebarExpanded 
                            ? isDarkMode ? "bg-zinc-800" : "bg-gray-200" 
                            : ""
                    )}
                    onClick={() => {
                        setSidebarExpanded(true);
                        setSelected("notes");
                    }}
                    title="Notes"
                >
                    <FileText size={18} />
                </Button>
                
                <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                        "h-8 w-8",
                        isDarkMode 
                            ? "text-gray-400 hover:text-white" 
                            : "text-gray-600 hover:text-gray-900",
                        selected === "settings" && !sidebarExpanded 
                            ? isDarkMode ? "bg-zinc-800" : "bg-gray-200" 
                            : ""
                    )}
                    onClick={() => {
                        setSidebarExpanded(true);
                        setSelected("settings");
                    }}
                    title="Settings"
                >
                    <SettingsIcon size={18} />
                </Button>
                
                {sessionActive && (
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className={cn(
                            "h-8 w-8",
                            isDarkMode 
                                ? "text-gray-400 hover:text-white" 
                                : "text-gray-600 hover:text-gray-900"
                        )}
                        onClick={() => {
                            setSidebarExpanded(true);
                        }}
                        title="Reading Session"
                    >
                        <BookOpen size={18} />
                    </Button>
                )}
            </div>
        </div>
    );
}
