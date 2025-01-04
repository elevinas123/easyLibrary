import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({ data });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOneByUsername(username: string) {
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

    async findOneByJwtPayload(jwt: string) {
        const decodedToken = this.jwtService.decode(jwt) as any;
        const username = decodedToken?.username;
        if (!username) {
            throw new Error("Invalid JWT");
        }
        return this.findOneByUsername(username);
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async remove(id: string) {
        const user = await this.prisma.user.delete({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
