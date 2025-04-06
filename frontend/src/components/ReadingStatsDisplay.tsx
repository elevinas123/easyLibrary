import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, BookOpen, BarChart3, Calendar } from "lucide-react";
import { cn } from "../lib/utils";
import { useAtom } from "jotai";
import { themeModeAtom } from "../atoms/themeAtom";
import { BookProgress, formatDate, formatReadingTime } from "../hooks/useReadingStats";
import { Book } from "../endPointTypes/types";

type ReadingStatsDisplayProps = {
    bookProgress?: BookProgress[];
    currentlyReadingBooks?: Book[];
    className?: string;
    showEmptyState?: boolean;
};

export function ReadingStatsDisplay({ 
    bookProgress, 
    currentlyReadingBooks, 
    className,
    showEmptyState = true
}: ReadingStatsDisplayProps) {
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    console.log(bookProgress);
    // Calculate total stats
    const totalReadingTime = bookProgress?.reduce((total, p) => total + (p.timeSpentReading || 0), 0) || 0;
    const totalPagesRead = bookProgress?.reduce((total, p) => total + (p.currentPage || 0), 0) || 0;
    const booksCount = currentlyReadingBooks?.length || 0;
    const lastReadDate = bookProgress && bookProgress.length > 0 
        ? bookProgress.sort((a, b) => 
            new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
          )[0].lastReadAt
        : null;

    if (!bookProgress?.length && !currentlyReadingBooks?.length && !showEmptyState) {
        return null;
    }

    return (
        <div className={cn("mt-8", className)}>
            <div className={cn(
                "flex items-center justify-between mb-4",
                isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
                <h2 className="text-xl font-serif font-medium">Reading Stats</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1.5" />
                            Time Reading
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDarkMode ? "text-white" : "text-amber-800"
                        )}>
                            {formatReadingTime(totalReadingTime)}
                        </p>
                    </CardContent>
                </Card>
                
                <Card className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                            <BookOpen className="h-4 w-4 mr-1.5" />
                            Books Reading
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDarkMode ? "text-white" : "text-amber-800"
                        )}>
                            {booksCount}
                        </p>
                    </CardContent>
                </Card>
                
                <Card className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                            <BarChart3 className="h-4 w-4 mr-1.5" />
                            Pages Read
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDarkMode ? "text-white" : "text-amber-800"
                        )}>
                            {totalPagesRead}
                        </p>
                    </CardContent>
                </Card>
                
                <Card className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-normal flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1.5" />
                            Last Read
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDarkMode ? "text-white" : "text-amber-800"
                        )}>
                            {lastReadDate ? formatDate(lastReadDate) : "Never"}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 