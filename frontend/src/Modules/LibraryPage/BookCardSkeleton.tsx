import { cn } from "../../lib/utils";

type BookCardSkeletonProps = {
    isDarkMode?: boolean;
};

export default function BookCardSkeleton({ isDarkMode = false }: BookCardSkeletonProps) {
    return (
        <div className={cn(
            "flex flex-col animate-pulse rounded-lg overflow-hidden border",
            isDarkMode ? "bg-zinc-800 border-gray-700" : "bg-white border-gray-200"
        )}>
            <div className="relative">
                <div className={cn(
                    "w-full h-64",
                    isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                )}></div>
                <div className="absolute top-2 right-2 flex space-x-1">
                    <div className={cn(
                        "w-8 h-8 rounded-full",
                        isDarkMode ? "bg-zinc-600" : "bg-gray-300"
                    )}></div>
                    <div className={cn(
                        "w-8 h-8 rounded-full",
                        isDarkMode ? "bg-zinc-600" : "bg-gray-300"
                    )}></div>
                </div>
            </div>
            <div className="flex-1 p-4 space-y-3">
                <div className={cn(
                    "h-5 rounded",
                    isDarkMode ? "bg-zinc-700" : "bg-gray-300"
                )} style={{ width: '70%' }}></div>
                <div className={cn(
                    "h-4 rounded",
                    isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                )} style={{ width: '50%' }}></div>
                <div className={cn(
                    "h-3 rounded",
                    isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                )} style={{ width: '40%' }}></div>
                <div className="flex space-x-2 pt-2">
                    <div className={cn(
                        "h-5 rounded-full px-3",
                        isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                    )} style={{ width: '25%' }}></div>
                    <div className={cn(
                        "h-5 rounded-full px-3",
                        isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                    )} style={{ width: '25%' }}></div>
                </div>
            </div>
            <div className="p-4 pt-0">
                <div className={cn(
                    "h-9 rounded",
                    isDarkMode ? "bg-zinc-700" : "bg-gray-200"
                )}></div>
            </div>
        </div>
    );
}
