import {
    ChevronLeft,
    ChevronRight,
    Home,
    Library,
    BookMarked,
    Star,
    History,
    LayoutDashboard,
    Settings,
    User
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { NavigateFunction, useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { Separator } from "../../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

type BookSidebarProps = {
    isCollapsed: boolean;
    toggleCollapse: () => void;
};

type SidebarButtonProps = {
    icon: React.ElementType;
    label: string;
    isCollapsed: boolean;
    navigate: NavigateFunction;
    route: string;
    isActive?: boolean;
    textVisible?: boolean;
};

const SidebarButton = ({
    icon: Icon,
    label,
    isCollapsed,
    navigate,
    route,
    isActive = false,
    textVisible = true
}: SidebarButtonProps) => {
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";
    
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "w-full justify-start",
                            isActive && (isDarkMode 
                                ? "bg-gray-800 text-white" 
                                : "bg-amber-100 text-gray-900"),
                            !isActive && (isDarkMode 
                                ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                                : "text-gray-700 hover:text-gray-900 hover:bg-amber-50")
                        )}
                        onClick={() => navigate(route)}
                    >
                        <Icon size={20} className={isActive ? "text-amber-600" : ""} />
                        {!isCollapsed && textVisible && (
                            <span className="ml-2 transition-opacity duration-150 opacity-100">
                                {label}
                            </span>
                        )}
                    </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    );
};

export default function BookSidebar({
    isCollapsed,
    toggleCollapse
}: BookSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [textVisible, setTextVisible] = useState(!isCollapsed);
    const [themeMode] = useAtom(themeModeAtom);
    const isDarkMode = themeMode === "dark";

    // Handle text visibility based on sidebar state
    useEffect(() => {
        if (isCollapsed) {
            setTextVisible(false);
        } else {
            // Small delay to ensure text appears after sidebar expands
            const timer = setTimeout(() => {
                setTextVisible(true);
            }, 150); // Half of the sidebar transition duration
            return () => clearTimeout(timer);
        }
    }, [isCollapsed]);

    // Check if a route is active
    const isRouteActive = (route: string) => {
        if (route === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(route);
    };

    return (
        <aside
            className={cn(
                "h-screen flex flex-col transition-all duration-300 border-r",
                isDarkMode 
                    ? "bg-gray-900 border-gray-800" 
                    : "bg-white border-gray-200",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-2">
                <Button
                    variant="ghost"
                    onClick={toggleCollapse}
                    className={cn(
                        "w-full justify-start p-2",
                        isDarkMode 
                            ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                            : "text-gray-600 hover:text-gray-900 hover:bg-amber-50"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronLeft size={20} />
                    ) : (
                        <ChevronRight size={20} />
                    )}
                    {!isCollapsed && textVisible && (
                        <span className="ml-2 transition-opacity duration-150 opacity-100">
                            Collapse
                        </span>
                    )}
                </Button>
            </div>

            <ScrollArea className="flex-grow">
                <div className="space-y-1 p-2">
                    <SidebarButton
                        icon={Home}
                        label="Home"
                        isCollapsed={isCollapsed}
                        navigate={navigate}
                        route="/"
                        isActive={isRouteActive('/')}
                        textVisible={textVisible}
                    />
                    
                    <SidebarButton
                        icon={Library}
                        label="Library"
                        isCollapsed={isCollapsed}
                        navigate={navigate}
                        route="/library"
                        isActive={isRouteActive('/library')}
                        textVisible={textVisible}
                    />
                    
                    <SidebarButton
                        icon={BookMarked}
                        label="Currently Reading"
                        isCollapsed={isCollapsed}
                        navigate={navigate}
                        route="/reading"
                        isActive={isRouteActive('/reading')}
                        textVisible={textVisible}
                    />
                    
                    <Separator className={cn(
                        "my-2",
                        isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    )} />
                    
                    <SidebarButton
                        icon={Star}
                        label="Favorites"
                        isCollapsed={isCollapsed}
                        navigate={navigate}
                        route="/favorites"
                        isActive={isRouteActive('/favorites')}
                        textVisible={textVisible}
                    />
                    
                    <SidebarButton
                        icon={History}
                        label="Reading History"
                        isCollapsed={isCollapsed}
                        navigate={navigate}
                        route="/history"
                        isActive={isRouteActive('/history')}
                        textVisible={textVisible}
                    />
                    
                    <Separator className={cn(
                        "my-2",
                        isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    )} />
                    
                    <SidebarButton
                        icon={LayoutDashboard}
                        label="Statistics"
                        isCollapsed={isCollapsed}
                        navigate={navigate}
                        route="/statistics"
                        isActive={isRouteActive('/statistics')}
                        textVisible={textVisible}
                    />
                </div>
            </ScrollArea>

            <div className={cn(
                "p-2 border-t",
                isDarkMode ? "border-gray-800" : "border-gray-200"
            )}>
                <SidebarButton
                    icon={Settings}
                    label="Settings"
                    isCollapsed={isCollapsed}
                    navigate={navigate}
                    route="/settings"
                    isActive={isRouteActive('/settings')}
                    textVisible={textVisible}
                />
                <SidebarButton
                    icon={User}
                    label="Profile"
                    isCollapsed={isCollapsed}
                    navigate={navigate}
                    route="/profile"
                    isActive={isRouteActive('/profile')}
                    textVisible={textVisible}
                />
            </div>
        </aside>
    );
} 