import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    BookOpen, 
    Calendar, 
    Clock, 
    BookText, 
    ChevronRight, 
    Trophy, 
    Star, 
    BarChart3 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { apiFetch } from "../../endPointTypes/apiClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/userAuth";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../LibraryPage/Sidebar";
import { useAtom } from "jotai";
import { themeModeAtom } from "../../atoms/themeAtom";
import { cn } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

// Types for reading history data
type ReadingSession = {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    pagesRead: number;
    book: {
        id: string;
        title: string;
        author: string;
        imageUrl: string;
    };
};

type ReadingStreak = {
    currentStreak: number;
    longestStreak: number;
    totalReadDays: number;
};

type ReadingStats = {
    totalBooksRead: number;
    totalPagesRead: number;
    totalReadingTime: number;
};

type BookProgress = {
    id: string;
    percentComplete: number;
    currentPage: number;
    isCompleted: boolean;
    completedAt: string | null;
    book: {
        id: string;
        title: string;
        author: string;
        imageUrl: string;
    };
};

type Activity = {
    type: string;
    description: string;
    timestamp: string;
    bookId: string;
};

// Fetch data functions
const fetchReadingSessions = async (userId: string, token: string) => {
    const data = await apiFetch(
        "GET /tracking/sessions/recent",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data.data;
};

const fetchReadingStreak = async (userId: string, token: string) => {
    const data = await apiFetch(
        "GET /tracking/streak",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data.data;
};

const fetchReadingStats = async (userId: string, token: string) => {
    const data = await apiFetch(
        "GET /tracking/stats",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data.data;
};

const fetchBookProgress = async (userId: string, token: string) => {
    const data = await apiFetch(
        "GET /tracking/progress/all",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return data.data;
};

export default function ReadingHistoryPage() {
  const { accessToken, user } = useAuth();
  const [themeMode] = useAtom(themeModeAtom);
  const isDarkMode = themeMode === "dark";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isCollapsed, toggleCollapse } = useSidebar([]);
  // Helper function to format duration with more precision
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      if (minutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${minutes}m`;
    }

    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    return `${minutes} minute${
      minutes !== 1 ? "s" : ""
    } and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return formatDate(dateString);
  };
  // Fetch reading history data
  const { data: sessions } = useQuery<ReadingSession[]>({
    queryKey: ["readingSessions"],
    queryFn: () => fetchReadingSessions(user?.id || "", accessToken || ""),
    enabled: !!accessToken && !!user,
  });

  const { data: streak } = useQuery<ReadingStreak>({
    queryKey: ["readingStreak"],
    queryFn: () => fetchReadingStreak(user?.id || "", accessToken || ""),
    enabled: !!accessToken && !!user,
  });

  const { data: stats } = useQuery<ReadingStats>({
    queryKey: ["readingStats"],
    queryFn: () => fetchReadingStats(user?.id || "", accessToken || ""),
    enabled: !!accessToken && !!user,
  });

  const { data: bookProgress } = useQuery<BookProgress[]>({
    queryKey: ["bookProgress"],
    queryFn: () => fetchBookProgress(user?.id || "", accessToken || ""),
    enabled: !!accessToken && !!user,
  });

  // Prepare data for activity feed
  const activityFeed: Activity[] = [];

  // Add reading sessions to activity feed
  if (sessions) {
    sessions.forEach((session) => {
      if (session.endTime) {
        activityFeed.push({
          type: "reading",
          description: `Read "${session.book.title}" for ${formatDuration(
            session.duration || 0
          )}`,
          timestamp: session.endTime,
          bookId: session.book.id,
        });
      }
    });
  }

  // Add completed books to activity feed
  if (bookProgress) {
    bookProgress
      .filter((progress) => progress.isCompleted && progress.completedAt)
      .forEach((progress) => {
        activityFeed.push({
          type: "completed",
          description: `Finished reading "${progress.book.title}"`,
          timestamp: progress.completedAt || "",
          bookId: progress.book.id,
        });
      });
  }

  // Sort activity feed by timestamp (newest first)
  activityFeed.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "flex h-screen",
        isDarkMode ? "bg-gray-900" : "bg-amber-50"
      )}
    >
      <Sidebar
        toggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
        setBooksLoading={() => {}}
      />

      <main
        className={cn(
          "flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out",
          isDarkMode ? "text-gray-200" : "text-gray-800"
        )}
      >
        <div className="flex flex-col space-y-4 mb-6">
          <h1
            className={cn(
              "text-3xl font-serif font-bold",
              isDarkMode ? "text-white" : "text-amber-800"
            )}
          >
            Reading History
          </h1>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList
              className={cn(
                "w-full md:w-auto justify-start",
                isDarkMode ? "bg-gray-800" : "bg-amber-100/50"
              )}
            >
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
            </TabsList>

            {/* Activity Feed Tab */}
            <TabsContent value="activity" className="space-y-6 mt-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {/* Reading Streak */}
                <Card
                  className={cn(
                    "col-span-1",
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Trophy
                        className={cn(
                          "mr-2 h-5 w-5",
                          isDarkMode ? "text-amber-500" : "text-amber-600"
                        )}
                      />
                      Reading Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Current Streak
                        </span>
                        <span className="text-xl font-bold">
                          {streak?.currentStreak || 0} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Longest Streak
                        </span>
                        <span className="text-lg">
                          {streak?.longestStreak || 0} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Total Reading Days
                        </span>
                        <span className="text-lg">
                          {streak?.totalReadDays || 0} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reading Stats Summary */}
                <Card
                  className={cn(
                    "col-span-2",
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3
                        className={cn(
                          "mr-2 h-5 w-5",
                          isDarkMode ? "text-amber-500" : "text-amber-600"
                        )}
                      />
                      Reading Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center space-y-1">
                        <div
                          className={cn(
                            "text-3xl font-bold",
                            isDarkMode ? "text-amber-500" : "text-amber-600"
                          )}
                        >
                          {stats?.totalBooksRead || 0}
                        </div>
                        <div
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Books Completed
                        </div>
                      </div>

                      <div className="text-center space-y-1">
                        <div
                          className={cn(
                            "text-3xl font-bold",
                            isDarkMode ? "text-amber-500" : "text-amber-600"
                          )}
                        >
                          {stats?.totalPagesRead || 0}
                        </div>
                        <div
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Pages Read
                        </div>
                      </div>

                      <div className="text-center space-y-1">
                        <div
                          className={cn(
                            "text-3xl font-bold",
                            isDarkMode ? "text-amber-500" : "text-amber-600"
                          )}
                        >
                          {stats?.totalReadingTime
                            ? Math.floor(stats.totalReadingTime / 3600)
                            : 0}
                        </div>
                        <div
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Hours Read
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Feed */}
              <Card
                className={cn(
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock
                      className={cn(
                        "mr-2 h-5 w-5",
                        isDarkMode ? "text-amber-500" : "text-amber-600"
                      )}
                    />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activityFeed.length > 0 ? (
                    <div className="space-y-4">
                      {activityFeed.map((activity, index) => (
                        <div key={index} className="relative pl-6">
                          {/* Activity line connector */}
                          {index < activityFeed.length - 1 && (
                            <div
                              className={cn(
                                "absolute top-6 bottom-0 left-3 w-0.5",
                                isDarkMode ? "bg-gray-700" : "bg-amber-100"
                              )}
                            ></div>
                          )}

                          {/* Activity dot */}
                          <div
                            className={cn(
                              "absolute top-1 left-0 w-6 h-6 rounded-full flex items-center justify-center",
                              activity.type === "completed"
                                ? isDarkMode
                                  ? "bg-green-900/30 text-green-500"
                                  : "bg-green-100 text-green-600"
                                : isDarkMode
                                ? "bg-amber-900/30 text-amber-500"
                                : "bg-amber-100 text-amber-600"
                            )}
                          >
                            {activity.type === "completed" ? (
                              <Star className="h-3 w-3" />
                            ) : (
                              <BookOpen className="h-3 w-3" />
                            )}
                          </div>

                          <div className="flex flex-col space-y-1 pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span
                                  className={
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-800"
                                  }
                                >
                                  {activity.description}
                                </span>
                                <Badge
                                  className={cn(
                                    "ml-2 text-xs",
                                    activity.type === "completed"
                                      ? isDarkMode
                                        ? "bg-green-900/30 text-green-500"
                                        : "bg-green-100 text-green-600"
                                      : isDarkMode
                                      ? "bg-amber-900/30 text-amber-500"
                                      : "bg-amber-100 text-amber-600"
                                  )}
                                >
                                  {activity.type === "completed"
                                    ? "Completed"
                                    : "Read"}
                                </Badge>
                              </div>
                              <span
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-gray-500" : "text-gray-500"
                                )}
                              >
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              )}
                            >
                              {formatDate(activity.timestamp)},{" "}
                              {formatTime(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        No reading activity recorded yet.
                      </p>
                      <Button
                        variant="link"
                        className={cn(
                          "mt-2",
                          isDarkMode ? "text-amber-500" : "text-amber-600"
                        )}
                        onClick={() => navigate("/")}
                      >
                        Start reading a book
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6 mt-6">
              <Card
                className={cn(
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader>
                  <CardTitle>Reading Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      Detailed reading statistics charts will be implemented
                      here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Books Tab */}
            <TabsContent value="books" className="space-y-6 mt-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Completed Books */}
                <Card
                  className={cn(
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookText
                        className={cn(
                          "mr-2 h-5 w-5",
                          isDarkMode ? "text-amber-500" : "text-amber-600"
                        )}
                      />
                      Completed Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookProgress?.filter((p) => p.isCompleted).length ? (
                      <div className="space-y-4">
                        {bookProgress
                          .filter((p) => p.isCompleted)
                          .map((progress) => (
                            <div
                              key={progress.id}
                              className={cn(
                                "flex items-center space-x-4 p-3 rounded-md cursor-pointer",
                                isDarkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-amber-50"
                              )}
                              onClick={() =>
                                navigate(`/book?id=${progress.book.id}`)
                              }
                            >
                              <img
                                src={progress.book.imageUrl}
                                alt={progress.book.title}
                                className="h-16 w-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4
                                  className={cn(
                                    "font-medium",
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  )}
                                >
                                  {progress.book.title}
                                </h4>
                                <p
                                  className={cn(
                                    "text-sm",
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  )}
                                >
                                  {progress.book.author}
                                </p>
                                {progress.completedAt && (
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode
                                        ? "text-gray-500"
                                        : "text-gray-500"
                                    )}
                                  >
                                    Completed on{" "}
                                    {formatDate(progress.completedAt)}
                                  </p>
                                )}
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-5 w-5",
                                  isDarkMode ? "text-gray-600" : "text-gray-400"
                                )}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <BookText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          You haven't completed any books yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* In Progress Books */}
                <Card
                  className={cn(
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen
                        className={cn(
                          "mr-2 h-5 w-5",
                          isDarkMode ? "text-amber-500" : "text-amber-600"
                        )}
                      />
                      In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookProgress?.filter((p) => !p.isCompleted).length ? (
                      <div className="space-y-4">
                        {bookProgress
                          .filter((p) => !p.isCompleted)
                          .map((progress) => (
                            <div
                              key={progress.id}
                              className={cn(
                                "flex items-center space-x-4 p-3 rounded-md cursor-pointer",
                                isDarkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-amber-50"
                              )}
                              onClick={() =>
                                navigate(`/book?id=${progress.book.id}`)
                              }
                            >
                              <img
                                src={progress.book.imageUrl}
                                alt={progress.book.title}
                                className="h-16 w-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4
                                  className={cn(
                                    "font-medium",
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  )}
                                >
                                  {progress.book.title}
                                </h4>
                                <p
                                  className={cn(
                                    "text-sm",
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  )}
                                >
                                  {progress.book.author}
                                </p>
                                <div className="flex items-center mt-1">
                                  <div
                                    className={cn(
                                      "h-1.5 rounded-full bg-gray-200 w-full mr-2",
                                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    )}
                                  >
                                    <div
                                      className="h-full rounded-full bg-amber-500"
                                      style={{
                                        width: `${
                                          progress.percentComplete * 100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span
                                    className={cn(
                                      "text-xs min-w-[40px]",
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    )}
                                  >
                                    {Math.round(progress.percentComplete * 100)}
                                    %
                                  </span>
                                </div>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-5 w-5",
                                  isDarkMode ? "text-gray-600" : "text-gray-400"
                                )}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          You don't have any books in progress.
                        </p>
                        <Button
                          variant="link"
                          className={cn(
                            "mt-2",
                            isDarkMode ? "text-amber-500" : "text-amber-600"
                          )}
                          onClick={() => navigate("/library")}
                        >
                          Browse your library
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}