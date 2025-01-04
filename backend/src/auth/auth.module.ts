import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "60m" },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService], // PrismaService registered here
    exports: [AuthService],
})
export class AuthModule {}
