import axios from "axios";
import { apiFetch } from "../endPointTypes/apiClient";

// Types for tracking data
export interface ReadingSession {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  pagesRead: number | null;
  lastPosition: number | null;
  book: {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
  };
}

export interface BookProgress {
  id: string;
  percentComplete: number;
  currentPage: number;
  totalPages: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt: string | null;
  lastReadAt: string | null;
  timeSpentReading: number;
  book: {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
  };
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  totalReadDays: number;
  lastReadDate: string | null;
}

export interface ReadingStats {
  totalBooksRead: number;
  totalPagesRead: number;
  totalReadingTime: number;
  averageReadingSpeed: number | null;
  favoriteGenre: string | null;
}

export interface ActivityItem {
  type: string;
  description: string;
  timestamp: string;
  bookId: string;
}

export interface ChartDataPoint {
  day: string;
  totalMinutes: number;
  pagesRead: number;
}

export interface GenreDistribution {
  genre: string;
  count: number;
}

export interface DashboardData {
  stats: ReadingStats;
  streak: ReadingStreak;
  recentActivity: ActivityItem[];
  readingProgressData: ChartDataPoint[];
  genreDistribution: GenreDistribution[];
}

// Get dashboard data
export const getDashboardData = async (userId: string, accessToken: string) => {
  console.log("labas rytas2");
  const { data } = await axios.get(`/api/tracking/dashboard?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("data", data);
  return data;
};
