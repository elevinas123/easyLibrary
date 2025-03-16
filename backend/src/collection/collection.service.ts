import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCollections(userId: string) {
    try {
      const collections = await this.prisma.collection.findMany({
        where: { userId },
        include: {
          books: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true,
                  imageUrl: true
                }
              }
            }
          },
          _count: {
            select: { books: true }
          }
        }
      });

      const formattedCollections = collections.map(collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        imageUrl: collection.imageUrl,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        bookCount: collection._count.books,
        books: collection.books.map(entry => ({
          id: entry.book.id,
          title: entry.book.title,
          author: entry.book.author,
          imageUrl: entry.book.imageUrl,
          addedAt: entry.addedAt
        }))
      }));

      return {
        success: true,
        data: formattedCollections
      };
    } catch (error) {
      console.error('Error fetching user collections:', error);
      return {
        success: false,
        error: 'Failed to fetch collections'
      };
    }
  }

  async getCollectionById(id: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id },
        include: {
          books: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  author: true,
                  description: true,
                  imageUrl: true,
                  dateAdded: true,
                  genres: {
                    include: {
                      genre: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!collection) {
        return {
          success: false,
          error: `Collection with ID ${id} not found`
        };
      }

      // Transform the data
      const booksWithDetails = collection.books.map(entry => ({
        ...entry.book,
        addedAt: entry.addedAt,
        genres: entry.book.genres.map(g => g.genre.name)
      }));

      return {
        success: true,
        data: {
          ...collection,
          books: booksWithDetails
        }
      };
    } catch (error) {
      console.error('Error fetching collection:', error);
      return {
        success: false,
        error: 'Failed to fetch collection'
      };
    }
  }

  async createCollection(data: { 
    name: string; 
    description?: string; 
    imageUrl?: string;
    userId: string 
  }) {
    try {
      // Check if collection with same name already exists for this user
      const existingCollection = await this.prisma.collection.findFirst({
        where: {
          name: data.name,
          userId: data.userId
        }
      });

      if (existingCollection) {
        return {
          success: false,
          error: `Collection named "${data.name}" already exists`
        };
      }

      const newCollection = await this.prisma.collection.create({
        data
      });

      return {
        success: true,
        data: newCollection
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      return {
        success: false,
        error: 'Failed to create collection'
      };
    }
  }

  async updateCollection(
    id: string, 
    data: { name?: string; description?: string; imageUrl?: string }
  ) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id }
      });

      if (!collection) {
        return {
          success: false,
          error: `Collection with ID ${id} not found`
        };
      }

      const updatedCollection = await this.prisma.collection.update({
        where: { id },
        data
      });

      return {
        success: true,
        data: updatedCollection
      };
    } catch (error) {
      console.error('Error updating collection:', error);
      return {
        success: false,
        error: 'Failed to update collection'
      };
    }
  }

  async deleteCollection(id: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id }
      });

      if (!collection) {
        return {
          success: false,
          error: `Collection with ID ${id} not found`
        };
      }

      await this.prisma.collection.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Collection deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting collection:', error);
      return {
        success: false,
        error: 'Failed to delete collection'
      };
    }
  }

  async addBookToCollection(collectionId: string, bookId: string) {
    try {
      // Check if collection exists
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId }
      });

      if (!collection) {
        return {
          success: false,
          error: `Collection with ID ${collectionId} not found`
        };
      }

      // Check if book exists
      const book = await this.prisma.book.findUnique({
        where: { id: bookId }
      });

      if (!book) {
        return {
          success: false,
          error: `Book with ID ${bookId} not found`
        };
      }

      // Check if book is already in collection
      const existingEntry = await this.prisma.bookCollection.findUnique({
        where: {
          bookId_collectionId: {
            bookId,
            collectionId
          }
        }
      });

      if (existingEntry) {
        return {
          success: false,
          error: 'Book already exists in this collection'
        };
      }

      // Add book to collection
      const bookCollection = await this.prisma.bookCollection.create({
        data: {
          book: { connect: { id: bookId } },
          collection: { connect: { id: collectionId } }
        },
        include: {
          book: true
        }
      });

      return {
        success: true,
        data: bookCollection
      };
    } catch (error) {
      console.error('Error adding book to collection:', error);
      return {
        success: false,
        error: 'Failed to add book to collection'
      };
    }
  }

  async removeBookFromCollection(collectionId: string, bookId: string) {
    try {
      // Check if the book is in the collection
      const bookCollection = await this.prisma.bookCollection.findUnique({
        where: {
          bookId_collectionId: {
            bookId,
            collectionId
          }
        }
      });

      if (!bookCollection) {
        return {
          success: false,
          error: 'Book is not in this collection'
        };
      }

      // Remove book from collection
      await this.prisma.bookCollection.delete({
        where: {
          bookId_collectionId: {
            bookId,
            collectionId
          }
        }
      });

      return {
        success: true,
        message: 'Book removed from collection successfully'
      };
    } catch (error) {
      console.error('Error removing book from collection:', error);
      return {
        success: false,
        error: 'Failed to remove book from collection'
      };
    }
  }
} 