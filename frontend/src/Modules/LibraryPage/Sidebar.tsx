import {
    ChevronLeft,
    ChevronRight,
    Home,
    Library,
    Settings,
    Sliders,
    Star,
    User
} from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import ImportBook from "./importBook";

type SidebarProps = {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    setBooksLoading: React.Dispatch<React.SetStateAction<string[]>>;
};

const SidebarButton = ({
    icon: Icon,
    label,
    isCollapsed,
}: {
    icon: React.ElementType;
    label: string;
    isCollapsed: boolean;
}) => (
    <Button variant="ghost" size="sm" className="w-full justify-start">
        <Icon size={20} />
        {!isCollapsed && <span className="ml-2">{label}</span>}
    </Button>
);

export default function Sidebar({
    isCollapsed,
    toggleCollapse,
    setBooksLoading,
}: SidebarProps) {
    return (
        <aside
            className={`h-screen bg-background border-r flex flex-col transition-all duration-300 ${
                isCollapsed ? "w-16" : "w-64"
            }`}
        >
            <div className="p-2">
                <Button
                    variant="ghost"
                    onClick={toggleCollapse}
                    className="w-full justify-start p-2"
                >
                    {isCollapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                    {!isCollapsed && <span className="ml-2">Collapse</span>}
                </Button>
            </div>

            <ScrollArea className="flex-grow">
                <div className="space-y-2 p-2">
                    <ImportBook
                        isCollapsed={isCollapsed}
                        setBooksLoading={setBooksLoading}
                    />
                    <SidebarButton
                        icon={Home}
                        label="Home"
                        isCollapsed={isCollapsed}
                    />
                    <SidebarButton
                        icon={Library}
                        label="Library"
                        isCollapsed={isCollapsed}
                    />
                    <SidebarButton
                        icon={Star}
                        label="Pinned"
                        isCollapsed={isCollapsed}
                    />
                </div>
            </ScrollArea>

            <div className="p-2 border-t">
                <SidebarButton
                    icon={Sliders}
                    label="Preferences"
                    isCollapsed={isCollapsed}
                />
                <SidebarButton
                    icon={Settings}
                    label="Settings"
                    isCollapsed={isCollapsed}
                />
                <SidebarButton
                    icon={User}
                    label="User"
                    isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
}
