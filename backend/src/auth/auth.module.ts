import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { PrismaService } from "../prisma/prisma.service";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy"; // Import JwtStrategy
import { LocalStrategy } from "./local.strategy"; // Import LocalStrategy

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "60m" },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        JwtStrategy, // Register JwtStrategy
        LocalStrategy, // Register LocalStrategy
    ],
    exports: [AuthService],
})
export class AuthModule {}
