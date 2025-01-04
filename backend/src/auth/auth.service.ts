import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt"; // Import bcrypt for password hashing

import { PrismaService } from "../prisma/prisma.service";

export type PrismaUserCreation = Prisma.UserCreateInput;

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(data: PrismaUserCreation) {
        const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword, // Store hashed password
            },
        });
    }
}
