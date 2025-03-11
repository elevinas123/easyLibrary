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
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
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
    const [showPanel, setShowPanel] = useState(false);

    const togglePanel = () => {
        setShowPanel(!showPanel);
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
        <div className="flex flex-col w-64 bg-white border-l border-gray-200 h-screen">
            <Tabs
                value={selected}
                onValueChange={(value) =>
                    setSelected(value as "notes" | "settings")
                }
                className="flex flex-col h-full"
            >
                <TabsList className="flex-shrink-0">
                    <TabsTrigger value="notes" className="flex-1">
                        Notes
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">
                        Settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="flex-grow overflow-auto">
                    <Notes />
                </TabsContent>
                <TabsContent
                    value="settings"
                    className="flex-grow overflow-auto p-4"
                >
                    <Settings />
                </TabsContent>
            </Tabs>

            <div className="relative">
                <button
                    onClick={togglePanel}
                    className="absolute top-4 right-4 z-10 bg-zinc-700 p-2 rounded-full"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>

                {showPanel && (
                    <div className="fixed right-0 top-0 h-screen w-80 bg-zinc-900 p-6 shadow-lg overflow-y-auto z-50">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Reading Session</h2>
                                <button
                                    onClick={togglePanel}
                                    className="text-gray-400 hover:text-gray-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>

                            {sessionActive ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Current Session</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Reading Time</p>
                                            <p className="text-lg font-medium">{formatReadingTime()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Page</p>
                                            <p className="text-lg font-medium">{currentPage} of {totalPages}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Progress</p>
                                            <Progress value={calculateProgress()} className="mt-2" />
                                        </div>
                                        <Button 
                                            variant="default" 
                                            className="w-full"
                                            onClick={onEndSession}
                                        >
                                            End Reading Session
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No active reading session</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
