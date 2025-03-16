import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  // Reading Session Methods
  async startReadingSession(userId: string, bookId: string) {
    return this.prisma.readingSession.create({
      data: {
        userId,
        bookId,
        startTime: new Date(),
      },
    });
  }

  async endReadingSession(
    sessionId: string, 
    pagesRead: number, 
    lastPosition: number
  ) {
    const session = await this.prisma.readingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Reading session not found');
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000
    );

    // Update the session
    const updatedSession = await this.prisma.readingSession.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration,
        pagesRead,
        lastPosition,
      },
    });

    // Update book progress
    await this.updateBookProgress(
      session.userId,
      session.bookId,
      lastPosition,
      pagesRead,
      duration
    );

    // Update reading streak
    await this.updateReadingStreak(session.userId);

    return updatedSession;
  }

  async getRecentSessions(userId: string, limit = 10) {
    return this.prisma.readingSession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: limit,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  // Book Progress Methods
  async updateBookProgress(
    userId: string,
    bookId: string,
    lastPosition: number,
    pagesRead: number,
    duration: number
  ) {
    // Get or create book progress
    const bookProgress = await this.prisma.bookProgress.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        percentComplete: lastPosition,
        currentPage: {
          increment: pagesRead,
        },
        lastReadAt: new Date(),
        timeSpentReading: {
          increment: duration,
        },
      },
      create: {
        userId,
        bookId,
        percentComplete: lastPosition,
        currentPage: pagesRead,
        lastReadAt: new Date(),
        timeSpentReading: duration,
      },
    });

    // Check if book is completed
    if (bookProgress.percentComplete >= 0.98 && !bookProgress.isCompleted) {
      await this.prisma.bookProgress.update({
        where: { id: bookProgress.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      // Update reading stats
      await this.updateReadingStats(userId);
    }

    return bookProgress;
  }

  async getBookProgress(userId: string, bookId: string) {
    return this.prisma.bookProgress.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }

  async getAllBookProgress(userId: string) {
    console.log("userId", userId);
    return this.prisma.bookProgress.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  // Reading Streak Methods
  async updateReadingStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create reading streak
    const streak = await this.prisma.readingStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      return this.prisma.readingStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastReadDate: today,
          totalReadDays: 1,
        },
      });
    }

    // If already read today, no need to update
    if (streak.lastReadDate && streak.lastReadDate.getTime() === today.getTime()) {
      return streak;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentStreak = streak.currentStreak;
    let longestStreak = streak.longestStreak;
    let totalReadDays = streak.totalReadDays + 1;

    // Check if the streak continues
    if (
      streak.lastReadDate &&
      streak.lastReadDate.getTime() === yesterday.getTime()
    ) {
      currentStreak += 1;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      // Streak broken
      currentStreak = 1;
    }

    return this.prisma.readingStreak.update({
      where: { userId },
      data: {
        currentStreak,
        longestStreak,
        lastReadDate: today,
        totalReadDays,
      },
    });
  }

  async getReadingStreak(userId: string) {
    return this.prisma.readingStreak.findUnique({
      where: { userId },
    });
  }

  // Reading Stats Methods
  async updateReadingStats(userId: string) {
    // Get completed books
    const completedBooks = await this.prisma.bookProgress.findMany({
      where: {
        userId,
        isCompleted: true,
      },
    });

    // Calculate total reading time
    const totalReadingTime = await this.prisma.readingSession.aggregate({
      where: { userId },
      _sum: { duration: true },
    });

    // Calculate total pages read
    const totalPagesRead = await this.prisma.readingSession.aggregate({
      where: { userId },
      _sum: { pagesRead: true },
    });

    // Find favorite genre (would require more complex query in a real app)
    // For now, we'll leave it null

    return this.prisma.readingStats.upsert({
      where: { userId },
      update: {
        totalBooksRead: completedBooks.length,
        totalReadingTime: totalReadingTime._sum.duration || 0,
        totalPagesRead: totalPagesRead._sum.pagesRead || 0,
        lastUpdated: new Date(),
      },
      create: {
        userId,
        totalBooksRead: completedBooks.length,
        totalReadingTime: totalReadingTime._sum.duration || 0,
        totalPagesRead: totalPagesRead._sum.pagesRead || 0,
      },
    });
  }

  async getReadingStats(userId: string) {
    return this.prisma.readingStats.findUnique({
      where: { userId },
    });
  }

  // Dashboard Data
  async getDashboardData(userId: string) {
    const [
      readingStats,
      readingStreak,
      recentSessions,
      bookProgress
    ] = await Promise.all([
      this.getReadingStats(userId),
      this.getReadingStreak(userId),
      this.getRecentSessions(userId, 5),
      this.getAllBookProgress(userId),
    ]);

    // Calculate reading progress over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const readingActivity = await this.prisma.readingSession.findMany({
      where: {
        userId,
        startTime: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Group by day for chart data
    const readingProgressData = this.groupReadingSessionsByDay(readingActivity);

    // Get genre distribution
    const genreDistribution = await this.getGenreDistribution(userId);

    return {
      stats: readingStats || {
        totalBooksRead: 0,
        totalPagesRead: 0,
        totalReadingTime: 0,
      },
      streak: readingStreak || {
        currentStreak: 0,
        longestStreak: 0,
        totalReadDays: 0,
      },
      recentActivity: this.formatRecentActivity(recentSessions, bookProgress),
      readingProgressData,
      genreDistribution,
    };
  }

  private groupReadingSessionsByDay(sessions) {
    const groupedByDay = {};
    
    sessions.forEach(session => {
      const date = new Date(session.startTime);
      const day = date.toISOString().split('T')[0];
      
      if (!groupedByDay[day]) {
        groupedByDay[day] = {
          day,
          totalMinutes: 0,
          pagesRead: 0,
        };
      }
      
      if (session.duration) {
        groupedByDay[day].totalMinutes += Math.floor(session.duration / 60);
      }
      
      if (session.pagesRead) {
        groupedByDay[day].pagesRead += session.pagesRead;
      }
    });
    
    return Object.values(groupedByDay);
  }

  private formatRecentActivity(sessions, bookProgress) {
    // Define the activity array with a proper type
    const activity: Array<{
      type: string;
      description: string;
      timestamp: Date | string;
      bookId: string;
    }> = [];
    
    // Add reading sessions
    sessions.forEach(session => {
      if (session.endTime) {
        const durationMinutes = Math.floor((session.duration || 0) / 60);
        activity.push({
          type: 'reading',
          description: `Read "${session.book.title}" for ${durationMinutes} minutes`,
          timestamp: session.endTime,
          bookId: session.bookId,
        });
      }
    });
    
    // Add completed books
    const completedBooks = bookProgress
      .filter(progress => progress.isCompleted && progress.completedAt)
      .map(progress => ({
        type: 'completed',
        description: `Finished reading "${progress.book.title}"`,
        timestamp: progress.completedAt,
        bookId: progress.bookId,
      }));
    
    return [...activity, ...completedBooks]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }

  async getGenreDistribution(_: string) {
    // This would be a more complex query in a real app
    // For now, we'll return mock data
    return [
      { genre: 'Fiction', count: 5 },
      { genre: 'Non-Fiction', count: 3 },
      { genre: 'Science Fiction', count: 2 },
      { genre: 'Fantasy', count: 4 },
      { genre: 'Mystery', count: 1 },
    ];
  }

  // Add this new method to handle direct progress updates from the reading page
  async updateBookProgressDirect(
    userId: string,
    bookId: string,
    percentComplete: number,
    currentPage: number
  ) {
    try {
      // Get existing book progress or create new one
      const bookProgress = await this.prisma.bookProgress.upsert({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
        update: {
          percentComplete: Math.min(Math.max(percentComplete, 0), 1), // Ensure between 0-1
          currentPage: currentPage,
          lastReadAt: new Date(),
        },
        create: {
          userId,
          bookId,
          percentComplete: Math.min(Math.max(percentComplete, 0), 1),
          currentPage: currentPage,
          lastReadAt: new Date(),
          timeSpentReading: 0, // Initial value
        },
      });

      // Check if book is completed (98% or more)
      if (bookProgress.percentComplete >= 0.98 && !bookProgress.isCompleted) {
        await this.prisma.bookProgress.update({
          where: { id: bookProgress.id },
          data: {
            isCompleted: true,
            completedAt: new Date(),
          },
        });

        // Update reading stats
        await this.updateReadingStats(userId);
      }

      return {
        success: true,
        data: bookProgress
      };
    } catch (error) {
      console.error('Error updating book progress:', error);
      return {
        success: false,
        error: 'Failed to update book progress'
      };
    }
  }
}
