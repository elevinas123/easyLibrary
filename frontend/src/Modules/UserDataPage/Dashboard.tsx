import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../LibraryPage/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { GenreDistributionChart } from "./components/GenreDistributionChart";
import { ReadingProgressChart } from "./components/ReadingProgressChart";
import { RecentActivity } from "./components/RecentActivity";
import { StatCards } from "./components/StatCards";

export default function Dashboard() {
    const { toggleCollapse, isCollapsed, setBooksLoading } = useSidebar();
    
    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                toggleCollapse={toggleCollapse}
                isCollapsed={isCollapsed}
                setBooksLoading={setBooksLoading}
            />
            <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6 max-w-7xl mx-auto">
                    <DashboardHeader />
                    <StatCards />
                    <RecentActivity />
                    
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ReadingProgressChart />
                        <GenreDistributionChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
