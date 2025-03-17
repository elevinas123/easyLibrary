import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { useAuth } from "../../hooks/userAuth";
import { cn } from "../../lib/utils";
import Sidebar from "../LibraryPage/Sidebar";
import { useSidebar } from "../../hooks/useSidebar";
import { apiFetch } from "../../endPointTypes/apiClient";
import { Book } from "../../endPointTypes/types";
import { 
  BookOpen, 
  Heart, 
  History, 
  FolderHeart, 
  BarChart3, 
  Clock, 
  BookText,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { fetchUserCollections } from "../../api/collectionsApi";
import { getDashboardData } from "../../api/trackingApi";
import Skeleton from "../../components/ui/skeleton";
export default function HomePage() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const [booksLoading, setBooksLoading] = useState<string[]>([]);
  const { isCollapsed, toggleCollapse } = useSidebar([]);

  // Fetch currently reading books
  const { data: currentlyReading, isLoading: loadingCurrentReading } = useQuery(
    {
      queryKey: ["currentlyReading", user?.id],
      queryFn: async () => {
        const response = await apiFetch(
          "GET /book/getCurrentlyReading",
          {
            query: {
              userId: user?.id,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("currentlyReadingBooks", response.data);
        return response.data.data as Book[];
      },
      enabled: !!user?.id && !!accessToken,
    }
  );
  // Fetch reading progress for all books
  const { data: bookProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["bookProgress", user?.id],
    queryFn: async () => {
      const data = await apiFetch(
        "GET /tracking/progress/all",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("bookProgress", data);
      return data.data as BookProgress[];
    },
    enabled: !!user?.id && !!accessToken,
  });

  // Fetch favorite books
  const { data: favoriteBooks, isLoading: loadingFavorites } = useQuery({
    queryKey: ["favoriteBooks", user?.id],
    queryFn: async () => {
      const response = await apiFetch(
        "GET /book/getFavorites",
        { query: { userId: user?.id } },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data?.data || [];
    },
    enabled: !!user?.id && !!accessToken,
  });

  // Fetch collections
  const { data: collectionsData, isLoading: loadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchUserCollections(user?.id || "", accessToken || ""),
    enabled: !!user?.id && !!accessToken,
  });

  const collections = collectionsData?.success
    ? collectionsData.data.slice(0, 3)
    : [];

  // Fetch dashboard data
  const { data: dashboardData, isLoading: loadingDashboard } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: async () => {
      if (!user?.id || !accessToken) {
        return {
          stats: {
            totalBooksRead: 0,
            totalPagesRead: 0,
            totalReadingTime: 0,
            averageReadingSpeed: null,
            favoriteGenre: null,
          },
          streak: {
            currentStreak: 0,
            longestStreak: 0,
            totalReadDays: 0,
            lastReadDate: null,
          },
          recentActivity: [],
          readingProgressData: [],
          genreDistribution: [],
        };
      }
      return getDashboardData(user.id, accessToken);
    },
    enabled: !!user?.id && !!accessToken,
  });

  // Function to get progress for a specific book
  const getBookProgress = (bookId: string) => {
    if (!bookProgress) return null;
    return bookProgress.find((progress) => progress.bookId === bookId);
  };

  // Format reading time from seconds to hours and minutes
  const formatReadingTime = (seconds: number = 0) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} mins`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        setBooksLoading={setBooksLoading}
      />

      <main
        className={cn(
          "flex-1 p-6 overflow-auto",
          isDarkMode ? "bg-gray-950 text-gray-200" : "bg-amber-50 text-gray-900"
        )}
      >
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.username || "Reader"}
            </h1>
            <p
              className={cn(
                "mt-1",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              Here's an overview of your reading activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Reading Streak"
              value={`${dashboardData?.streak?.currentStreak || 0} days`}
              icon={<Clock className="h-5 w-5" />}
              description={
                dashboardData?.streak?.lastReadDate
                  ? `Last read: ${formatDate(
                      dashboardData.streak.lastReadDate
                    )}`
                  : "Start reading to build your streak"
              }
              isLoading={loadingDashboard}
              isDarkMode={isDarkMode}
            />

            <StatCard
              title="Books Read"
              value={dashboardData?.stats?.totalBooksRead?.toString() || "0"}
              icon={<BookText className="h-5 w-5" />}
              description="Completed books"
              isLoading={loadingDashboard}
              isDarkMode={isDarkMode}
            />

            <StatCard
              title="Pages Read"
              value={dashboardData?.stats?.totalPagesRead?.toString() || "0"}
              icon={<BookOpen className="h-5 w-5" />}
              description="Total pages completed"
              isLoading={loadingDashboard}
              isDarkMode={isDarkMode}
            />

            <StatCard
              title="Reading Time"
              value={formatReadingTime(dashboardData?.stats?.totalReadingTime)}
              icon={<BarChart3 className="h-5 w-5" />}
              description="Total time spent reading"
              isLoading={loadingDashboard}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Currently Reading Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <BookOpen
                  className={cn(
                    "mr-2 h-5 w-5",
                    isDarkMode ? "text-amber-500" : "text-amber-600"
                  )}
                />
                Currently Reading
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className={
                  isDarkMode
                    ? "text-amber-500 hover:text-amber-400"
                    : "text-amber-600 hover:text-amber-700"
                }
                onClick={() => navigate("/reading")}
              >
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {loadingCurrentReading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            ) : currentlyReading?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentlyReading.slice(0, 3).map((item: any) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all hover:shadow-md",
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    )}
                    onClick={() => navigate(`/book?id=${item.book.id}`)}
                  >
                    <CardContent className="flex p-4">
                      <div className="mr-4">
                        <div className="h-24 w-16 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className={cn(
                                "h-full w-full flex items-center justify-center",
                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                              )}
                            >
                              <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">
                          {item.title}
                        </h3>
                        <p
                          className={cn(
                            "text-sm line-clamp-1",
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          )}
                        >
                          {item.author}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                getBookProgress(item.id)?.percentComplete * 100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              getBookProgress(item.id)?.percentComplete * 100
                            }
                            className={cn(
                              "h-1.5",
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            )}
                            indicatorClassName="bg-amber-500"
                          />
                          <p
                            className={cn(
                              "text-xs mt-2",
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            )}
                          >
                            Last read: {formatDate(getBookProgress(item.id)?.lastReadAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card
                className={cn(
                  "border",
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <BookOpen
                    className={cn(
                      "h-12 w-12 mb-4",
                      isDarkMode ? "text-gray-700" : "text-gray-300"
                    )}
                  />
                  <p
                    className={cn(
                      "text-center mb-4",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    You're not currently reading any books
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Browse your library
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Two Column Layout for Favorites and Collections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Favorites Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Heart
                    className={cn(
                      "mr-2 h-5 w-5",
                      isDarkMode ? "text-red-500" : "text-red-600"
                    )}
                  />
                  Favorites
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    isDarkMode
                      ? "text-red-500 hover:text-red-400"
                      : "text-red-600 hover:text-red-700"
                  }
                  onClick={() => navigate("/favorites")}
                >
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {loadingFavorites ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : favoriteBooks?.length > 0 ? (
                <Card
                  className={cn(
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {favoriteBooks.slice(0, 5).map((book: Book) => (
                        <div
                          key={book.id}
                          className={cn(
                            "flex items-center p-3 cursor-pointer",
                            isDarkMode
                              ? "hover:bg-gray-750"
                              : "hover:bg-gray-50"
                          )}
                          onClick={() => navigate(`/book?id=${book.id}`)}
                        >
                          <div className="h-12 w-8 mr-3 rounded overflow-hidden">
                            {book.imageUrl ? (
                              <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div
                                className={cn(
                                  "h-full w-full flex items-center justify-center",
                                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                                )}
                              >
                                <BookOpen className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {book.title}
                            </h3>
                            <p
                              className={cn(
                                "text-sm truncate",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              )}
                            >
                              {book.author}
                            </p>
                          </div>
                          <Heart className="h-4 w-4 text-red-500 fill-red-500 ml-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className={cn(
                    "border",
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Heart
                      className={cn(
                        "h-12 w-12 mb-4",
                        isDarkMode ? "text-gray-700" : "text-gray-300"
                      )}
                    />
                    <p
                      className={cn(
                        "text-center mb-4",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      You haven't added any favorites yet
                    </p>
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Browse your library
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Collections Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FolderHeart
                    className={cn(
                      "mr-2 h-5 w-5",
                      isDarkMode ? "text-amber-500" : "text-amber-600"
                    )}
                  />
                  Collections
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    isDarkMode
                      ? "text-amber-500 hover:text-amber-400"
                      : "text-amber-600 hover:text-amber-700"
                  }
                  onClick={() => navigate("/collections")}
                >
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {loadingCollections ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : collections?.length > 0 ? (
                <Card
                  className={cn(
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {collections.map((collection) => (
                        <div
                          key={collection.id}
                          className={cn(
                            "flex items-center p-3 cursor-pointer",
                            isDarkMode
                              ? "hover:bg-gray-750"
                              : "hover:bg-gray-50"
                          )}
                          onClick={() =>
                            navigate(`/collections/${collection.id}`)
                          }
                        >
                          <div
                            className={cn(
                              "h-12 w-12 rounded mr-3 flex items-center justify-center",
                              isDarkMode ? "bg-gray-700" : "bg-amber-100"
                            )}
                          >
                            {collection.imageUrl ? (
                              <img
                                src={collection.imageUrl}
                                alt={collection.name}
                                className="h-full w-full object-cover rounded"
                              />
                            ) : (
                              <FolderHeart
                                className={cn(
                                  "h-6 w-6",
                                  isDarkMode
                                    ? "text-amber-500/30"
                                    : "text-amber-500/50"
                                )}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {collection.name}
                            </h3>
                            <p
                              className={cn(
                                "text-sm truncate",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              )}
                            >
                              {collection.bookCount || 0}{" "}
                              {collection.bookCount === 1 ? "book" : "books"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter
                    className={cn(
                      "border-t p-3",
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    )}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate("/collections")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create new collection
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card
                  className={cn(
                    "border",
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <FolderHeart
                      className={cn(
                        "h-12 w-12 mb-4",
                        isDarkMode ? "text-gray-700" : "text-gray-300"
                      )}
                    />
                    <p
                      className={cn(
                        "text-center mb-4",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      You haven't created any collections yet
                    </p>
                    <Button
                      onClick={() => navigate("/collections")}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Create a collection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <History
                  className={cn(
                    "mr-2 h-5 w-5",
                    isDarkMode ? "text-blue-500" : "text-blue-600"
                  )}
                />
                Recent Activity
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className={
                  isDarkMode
                    ? "text-blue-500 hover:text-blue-400"
                    : "text-blue-600 hover:text-blue-700"
                }
                onClick={() => navigate("/history")}
              >
                View history <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {loadingDashboard ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : dashboardData?.recentActivity?.length > 0 ? (
              <Card
                className={cn(
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dashboardData.recentActivity
                      .slice(0, 5)
                      .map((activity, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex justify-between items-center p-3",
                            isDarkMode
                              ? "hover:bg-gray-750"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <p
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {activity.description}
                          </p>
                          <span
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            )}
                          >
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={cn(
                  "border",
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <History
                    className={cn(
                      "h-12 w-12 mb-4",
                      isDarkMode ? "text-gray-700" : "text-gray-300"
                    )}
                  />
                  <p
                    className={cn(
                      "text-center mb-4",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    No reading activity recorded yet
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start reading
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

function StatCard({ title, value, icon, description, isLoading, isDarkMode }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn(
        "border",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center mb-2">
            <Skeleton className="h-5 w-5 rounded-full mr-2" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <Skeleton className="h-8 w-16 rounded mt-2" />
          <Skeleton className="h-3 w-32 rounded mt-2" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(
      "border",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <div className={cn(
            "mr-2",
            isDarkMode ? "text-amber-500" : "text-amber-600"
          )}>
            {icon}
          </div>
          <h3 className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {title}
          </h3>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className={cn(
            "text-xs mt-1",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 