import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('session/start')
  async startReadingSession(
    @Request() req,
    @Body() data: { bookId: string }
  ) {
    return this.trackingService.startReadingSession(
      req.user.userId,
      data.bookId
    );
  }

  @Post('session/end')
  async endReadingSession(
    @Body() data: { 
      sessionId: string; 
      pagesRead: number; 
      lastPosition: number 
    }
  ) {
    return this.trackingService.endReadingSession(
      data.sessionId,
      data.pagesRead,
      data.lastPosition
    );
  }

  @Get('sessions/recent')
  async getRecentSessions(@Request() req) {
    return this.trackingService.getRecentSessions(req.user.userId);
  }

  @Get('progress/book/:bookId')
  async getBookProgress(@Request() req, @Param('bookId') bookId: string) {
    return this.trackingService.getBookProgress(req.user.userId, bookId);
  }

  @Get('progress/all')
  async getAllBookProgress(@Request() req) {
    return this.trackingService.getAllBookProgress(req.user.userId);
  }

  @Get('streak')
  async getReadingStreak(@Request() req) {
    return this.trackingService.getReadingStreak(req.user.userId);
  }

  @Get('stats')
  async getReadingStats(@Request() req) {
    return this.trackingService.getReadingStats(req.user.userId);
  }

  @Get('dashboard')
  async getDashboardData(@Query('userId') userId: string) {
    return this.trackingService.getDashboardData(userId);
  }

  @Post('progress/update')
  async updateBookProgress(@Request() req, @Body() body: { bookId: string, percentComplete: number, currentPage: number }) {
    const userId = req.user.userId;
    const { bookId, percentComplete, currentPage } = body;
    
    return this.trackingService.updateBookProgressDirect(
      userId,
      bookId,
      percentComplete,
      currentPage
    );
  }
}
