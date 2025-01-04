import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma, User } from "@prisma/client"; // Import Prisma's User type

import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    // Create a new user
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    // Get all users
    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    // Find a user by username
    async findOneByUsername(username: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            throw new NotFoundException(
                `User with username ${username} not found`
            );
        }
        return user;
    }

    // Find a user by JWT payload
    async findOneByJwtPayload(jwt: string): Promise<User> {
        const decodedToken = this.jwtService.decode(jwt) as {
            username?: string;
        };
        const username = decodedToken?.username;
        if (!username) {
            throw new Error("Invalid JWT");
        }
        return this.findOneByUsername(username);
    }

    // Find a user by ID
    async findOne(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // Update a user by ID
    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // Remove a user by ID
    async remove(id: string): Promise<User> {
        const user = await this.prisma.user.delete({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
