import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../LibraryPage/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { GenreDistributionChart } from "./components/GenreDistributionChart";
import { ReadingProgressChart } from "./components/ReadingProgressChart";
import { RecentActivity } from "./components/RecentActivity";
import { StatCards } from "./components/StatCards";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../../api/trackingApi";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "../../hooks/userAuth";

export default function Dashboard() {
    const { toggleCollapse, isCollapsed, setBooksLoading } = useSidebar();
    const { user, accessToken } = useAuth();
    console.log("hi"); 
    const { data: dashboardData, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboard', user?.id],
        queryFn: async () => {
            if (!user?.id || !accessToken) {
                // Return empty dashboard data instead of undefined
                return {
                    stats: {
                        totalBooksRead: 0,
                        totalPagesRead: 0,
                        totalReadingTime: 0,
                        averageReadingSpeed: null,
                        favoriteGenre: null
                    },
                    streak: {
                        currentStreak: 0,
                        longestStreak: 0,
                        totalReadDays: 0,
                        lastReadDate: null
                    },
                    recentActivity: [],
                    readingProgressData: [],
                    genreDistribution: []
                };
            }
            return getDashboardData(user.id, accessToken);
        },
        // Only run the query when we have a user ID and access token
        enabled: !!user?.id && !!accessToken
    });
    
    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                toggleCollapse={toggleCollapse}
                isCollapsed={isCollapsed}
                setBooksLoading={setBooksLoading}
            />
            <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6 max-w-7xl mx-auto">
                    <DashboardHeader onRefresh={() => refetch()} />
                    
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                            <Skeleton className="h-64 w-full" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Skeleton className="h-80 w-full" />
                                <Skeleton className="h-80 w-full" />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-medium">Failed to load dashboard data</h3>
                            <p className="text-muted-foreground">Please try again later</p>
                        </div>
                    ) : (
                        <>
                            <StatCards 
                                stats={dashboardData?.stats}
                                streak={dashboardData?.streak}
                            />
                            <RecentActivity activities={dashboardData?.recentActivity || []} />
                            
                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ReadingProgressChart data={dashboardData?.readingProgressData || []} />
                                <GenreDistributionChart data={dashboardData?.genreDistribution || []} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
