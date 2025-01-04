import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service"; // Import PrismaService

@Injectable()
export class BookService {
    constructor(private readonly prisma: PrismaService) {}

    async addBook(data: Prisma.BookCreateInput) {
        return this.prisma.book.create({ data });
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
                // Exclude bookElements or any other fields as needed
            },
        });
    }

    async getBookById(id: string) {
        const book = await this.prisma.book.findUnique({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    async updateBook(id: string, data: Prisma.BookUpdateInput) {
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
}
