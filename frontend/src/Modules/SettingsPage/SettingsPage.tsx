import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../LibraryPage/Sidebar";
import Settings from "../Settings/Settings";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [booksLoading, setBooksLoading] = React.useState<string[]>([]);
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                setBooksLoading={setBooksLoading}
            />
            <div className={cn(
                "flex-1 p-6 overflow-auto",
                isDarkMode ? "bg-gray-950 text-gray-200" : "bg-amber-50 text-gray-900"
            )}>
                <div className="max-w-3xl mx-auto">
                    <h1 className={cn(
                        "text-2xl font-bold mb-6",
                        isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                        User Settings
                    </h1>
                    <div className={cn(
                        "p-6 rounded-lg shadow-md",
                        isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
                    )}>
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    );
} 