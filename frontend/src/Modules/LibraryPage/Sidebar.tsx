// src/components/Sidebar.jsx
import { useState } from "react";
import {
    FiBook,
    FiHome,
    FiMenu,
    FiSettings,
    FiSliders,
    FiStar,
    FiUser,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge"; // Optional: for conditional classNames
import ImportBook from "./importBook";

type SidebarProps = {
    setBooksLoading: React.Dispatch<React.SetStateAction<string[]>>;
};
export default function Sidebar({setBooksLoading}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    

    return (
        <div
            className={twMerge(
                "sticky top-0 h-screen bg-zinc-700 text-gray-200 flex flex-col justify-between transition-width duration-300 ",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Top Section */}
            <div className="flex flex-col">
                <button
                    onClick={toggleCollapse}
                    className="flex items-center justify-center p-4 hover:bg-gray-700 transition-colors"
                >
                    <FiMenu size={24} />
                    {!isCollapsed && <span className="ml-2">Collapse</span>}
                </button>
                <ImportBook isCollapsed={isCollapsed} setBooksLoading={setBooksLoading} />
            </div>

            {/* Middle Section */}
            <div className="flex flex-col">
                <button className="flex items-center p-4 hover:bg-gray-700 transition-colors">
                    <FiHome size={24} />
                    {!isCollapsed && <span className="ml-2">Home</span>}
                </button>
                <button className="flex items-center p-4 hover:bg-gray-700 transition-colors">
                    <FiBook size={24} />
                    {!isCollapsed && <span className="ml-2">Library</span>}
                </button>
                <button className="flex items-center p-4 hover:bg-gray-700 transition-colors">
                    <FiStar size={24} />
                    {!isCollapsed && <span className="ml-2">Pinned</span>}
                </button>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col">
                <button className="flex items-center p-4 hover:bg-gray-700 transition-colors">
                    <FiSliders size={24} />
                    {!isCollapsed && <span className="ml-2">Preferences</span>}
                </button>
                <button className="flex items-center p-4 hover:bg-gray-700 transition-colors">
                    <FiSettings size={24} />
                    {!isCollapsed && <span className="ml-2">Settings</span>}
                </button>
                <button className="flex items-center p-4 hover:bg-gray-700 transition-colors">
                    <FiUser size={24} />
                    {!isCollapsed && <span className="ml-2">User</span>}
                </button>
            </div>
        </div>
    );
}
