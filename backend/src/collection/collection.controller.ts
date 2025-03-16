import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollectionService } from './collection.service';

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  async getUserCollections(@Request() req, @Query('userId') userId: string) {
    return this.collectionService.getUserCollections(userId || req.user.userId);
  }

  @Get(':id')
  async getCollection(@Param('id') id: string) {
    return this.collectionService.getCollectionById(id);
  }

  @Post()
  async createCollection(
    @Request() req,
    @Body() data: { name: string; description?: string; imageUrl?: string }
  ) {
    return this.collectionService.createCollection({
      ...data,
      userId: req.user.userId
    });
  }

  @Put(':id')
  async updateCollection(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string; imageUrl?: string }
  ) {
    return this.collectionService.updateCollection(id, data);
  }

  @Delete(':id')
  async deleteCollection(@Param('id') id: string) {
    return this.collectionService.deleteCollection(id);
  }

  @Post(':collectionId/books/:bookId')
  async addBookToCollection(
    @Param('collectionId') collectionId: string,
    @Param('bookId') bookId: string
  ) {
    return this.collectionService.addBookToCollection(collectionId, bookId);
  }

  @Delete(':collectionId/books/:bookId')
  async removeBookFromCollection(
    @Param('collectionId') collectionId: string,
    @Param('bookId') bookId: string
  ) {
    return this.collectionService.removeBookFromCollection(collectionId, bookId);
  }
} 