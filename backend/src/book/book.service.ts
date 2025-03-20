import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service"; // Import PrismaService

@Injectable()
export class BookService {
    constructor(private readonly prisma: PrismaService) {}
    async addBook(data: any) {
        const {
            userId,
            genres, // Array of genre names
            bookshelves,
            bookElements,
            canvaElements,
            curveElements,
            highlights,
            offsetPosition,
            chaptersData,
            id,
            ...rest
        } = data;

        console.log("data", data);
        return this.prisma.book.create({
            data: {
                ...rest,
                user: {
                    connect: { id: userId },
                },
                genres: {
                    create: genres.map((genreName: string) => ({
                        genre: {
                            connectOrCreate: {
                                where: { name: genreName },
                                create: { name: genreName },
                            },
                        },
                    })),
                },
                bookshelves: {
                    connect: bookshelves.map((shelfId: string) => ({
                        id: shelfId,
                    })),
                },
                bookElements: {
                    create: bookElements || [],
                },
                canvaElements: {
                    create: canvaElements?.map((canvaElement) => ({
                        ...canvaElement,
                        points: {
                            create: canvaElement.points || [],
                        },
                        outgoingArrows: {
                            create: canvaElement.outgoingArrows || [],
                        },
                        incomingArrows: {
                            create: canvaElement.incomingArrows || [],
                        },
                        circleElements: {
                            create: canvaElement.circleElements || [],
                        },
                        rectElements: {
                            create: canvaElement.rectElements || [],
                        },
                        textElements: {
                            create: canvaElement.textElements || [],
                        },
                    })),
                },
                curveElements: {
                    create: curveElements?.map((curveElement) => ({
                        ...curveElement,
                        points: {
                            create: curveElement.points || [],
                        },
                        arrowElements: {
                            create: curveElement.arrowElements || [],
                        },
                    })),
                },
                highlights: {
                    create: highlights || [],
                },
                offsetPosition: offsetPosition
                    ? { create: offsetPosition }
                    : undefined,
                chaptersData: {
                    create: chaptersData || [],
                },
                totalPages: data.totalPages || 0,
            },
        });
    }

    async getAllBooks() {
        return this.prisma.book.findMany();
    }

    async getUserBooks(userId: string) {
        return this.prisma.book.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                description: true,
                author: true,
                imageUrl: true,
                totalPages: true,
                dateAdded: true,
                liked: true,
                // Exclude bookElements or any other fields as needed
            },
        });
    }

    async getBookById(id: string) {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: {
                genres: true,
                bookshelves: true,
                bookElements: {
                    orderBy: {
                        lineY: "asc",
                    },
                },
                canvaElements: true,
                curveElements: true,
                highlights: true,
                offsetPosition: true,
                chaptersData: true,
                
            },
        });
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    async updateBook(id: string, data: Prisma.BookUpdateInput) {
        console.log("Updating book", id, data);
        const updatedBook = await this.prisma.book.update({
            where: { id },
            data,
        });
        if (!updatedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updatedBook;
    }

    async deleteBook(id: string) {
        const deletedBook = await this.prisma.book.delete({ where: { id } });
        if (!deletedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return deletedBook;
    }

    async getCurrentlyReading(userId: string) {
        // Get books that the user is currently reading (in progress but not completed)
        try {
            console.log("userId", userId);
            // Alternative approach - get bookIds ordered by lastReadAt first
            const bookProgressOrdered = await this.prisma.bookProgress.findMany({
                where: {
                    userId: userId,
                    isCompleted: false,
                },
                orderBy: {
                    lastReadAt: 'desc'
                },
                select: {
                    bookId: true
                }
            });
            console.log("bookProgressOrdered", bookProgressOrdered);
            
            // Use this ordered list to fetch books in the correct order
            const bookIds = bookProgressOrdered.map(progress => progress.bookId);
            
            // Now fetch the actual books with those IDs
            const books = await this.prisma.book.findMany({
                where: {
                    id: {
                        in: bookIds
                    }
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    author: true,
                    imageUrl: true,
                    liked: true,
                    dateAdded: true,
                    scale: true,
                    userId: true,
                    totalPages: true,
                    genres: {
                        include: {
                            genre: true
                        }
                    },
                    bookProgress: {
                        orderBy: {
                            lastReadAt: 'desc'
                        }
                    }
                }
            });
            console.log("books", books);
            // Manually sort books to match the order of bookIds
            const sortedBooks = bookIds.map(id => 
                books.find(book => book.id === id)
            ).filter(Boolean);
            console.log("sortedBooks", sortedBooks);
            
            return {
                success: true,
                data: sortedBooks
            };
        } catch (error) {
            console.error('Error fetching currently reading books:', error);
            return {
                success: false,
                error: 'Failed to fetch currently reading books'
            };
        }
    }

    async getFavoriteBooks(userId: string) {
        try {
            const books = await this.prisma.book.findMany({
                where: { 
                    userId,
                    liked: true 
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    author: true,
                    imageUrl: true,
                    liked: true,
                    dateAdded: true,
                    scale: true,
                    userId: true,
                    totalPages: true,
                    genres: {
                        include: {
                            genre: true
                        }
                    }
                }
            });
            
            // Transform the data to include the genres properly
            const booksWithGenres = books.map(book => ({
                ...book,
                genres: book.genres.map(g => g.genre.name)
            }));
            
            return {
                success: true,
                data: booksWithGenres
            };
        } catch (error) {
            console.error('Error fetching favorite books:', error);
            return {
                success: false,
                error: 'Failed to fetch favorite books'
            };
        }
    }
}
