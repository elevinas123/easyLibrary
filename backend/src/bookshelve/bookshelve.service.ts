import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookshelveService {
    constructor(private readonly prisma: PrismaService) {}

    async addBookshelve(data: Prisma.BookshelveCreateInput) {
        return this.prisma.bookshelve.create({ data });
    }

    async getAllBookshelves() {
        return this.prisma.bookshelve.findMany();
    }

    async getBookshelveById(id: string) {
        const bookshelve = await this.prisma.bookshelve.findUnique({
            where: { id },
        });
        if (!bookshelve) {
            throw new NotFoundException(`Bookshelve with ID ${id} not found`);
        }
        return bookshelve;
    }

    async updateBookshelve(id: string, data: Prisma.BookshelveUpdateInput) {
        const updatedBookshelve = await this.prisma.bookshelve.update({
            where: { id },
            data,
        });
        if (!updatedBookshelve) {
            throw new NotFoundException(`Bookshelve with ID ${id} not found`);
        }
        return updatedBookshelve;
    }

    async addBookToBookshelve(bookshelveId: string, bookId: string) {
        const bookshelve = await this.prisma.bookshelve.findUnique({
            where: { id: bookshelveId },
            include: { books: true },
        });
        if (!bookshelve) {
            throw new NotFoundException(
                `Bookshelve with ID ${bookshelveId} not found`
            );
        }

        const bookAlreadyExists = bookshelve.books.some(
            (book) => book.id === bookId
        );
        if (bookAlreadyExists) {
            throw new NotFoundException(
                `Book with ID ${bookId} already exists in the bookshelve`
            );
        }

        return this.prisma.bookshelve.update({
            where: { id: bookshelveId },
            data: {
                books: {
                    connect: { id: bookId },
                },
            },
        });
    }

    async deleteBookshelve(id: string) {
        const deletedBookshelve = await this.prisma.bookshelve.delete({
            where: { id },
        });
        if (!deletedBookshelve) {
            throw new NotFoundException(`Bookshelve with ID ${id} not found`);
        }
        return deletedBookshelve;
    }
}
