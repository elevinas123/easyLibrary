import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService, PrismaUserCreation } from "./auth.service";
import { LocalAuthGuard } from "./localAuthGuard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @Post("register")
    async register(@Body() data: PrismaUserCreation) {
        return this.authService.register(data);
    }
}
