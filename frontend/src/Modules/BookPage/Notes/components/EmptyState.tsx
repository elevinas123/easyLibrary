import { ArrowLeftRight } from "lucide-react";
import { cn } from "../../../../lib/utils";

type EmptyStateProps = {
    isDarkMode: boolean;
};

export const EmptyState = ({ isDarkMode }: EmptyStateProps) => {
    return (
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
    );
}; 