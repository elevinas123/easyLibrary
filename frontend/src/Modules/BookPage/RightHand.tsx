// RightHand.tsx

import { useState } from "react";
import Notes from "./Notes";
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
                    {sidebarExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
                
                <div className={cn(
                    "flex-grow text-center transition-opacity duration-200 mr-8",
                    sidebarExpanded ? "opacity-100" : "opacity-0 invisible"
                )}>
                    <div className="text-sm font-medium text-gray-300">Tools</div>
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
                            <TabsList className="flex-shrink-0 bg-zinc-800 p-1 mx-4 mt-4 rounded-md">
                                <TabsTrigger 
                                    value="notes" 
                                    className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                                >
                                    <FileText size={16} className="mr-2" />
                                    Notes
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="settings" 
                                    className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
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
                            <div className="p-4 border-t border-gray-800">
                                <Card className="bg-zinc-800 border-0 text-gray-300">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400">Reading Time</p>
                                            <p className="text-sm font-medium">{formatReadingTime()}</p>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-400">Progress</p>
                                                <p className="text-xs text-gray-400">{currentPage} of {totalPages}</p>
                                            </div>
                                            <Progress 
                                                value={calculateProgress()} 
                                                className="h-1.5 bg-zinc-700" 
                                            />
                                        </div>
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="w-full text-xs border-gray-700 hover:bg-zinc-700 hover:text-white"
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
                    className="text-gray-400 hover:text-white h-8 w-8"
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
                    className="text-gray-400 hover:text-white h-8 w-8"
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
                        className="text-gray-400 hover:text-white h-8 w-8"
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
