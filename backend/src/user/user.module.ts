import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { PrismaService } from "../prisma/prisma.service";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    providers: [UserService, PrismaService],
    controllers: [UserController],
    imports: [JwtModule],
    exports: [UserService],
})
export class UserModule {}
