import { Body, Controller, Post, Request, UseGuards, Put } from "@nestjs/common";

import { Prisma } from "@prisma/client";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./localAuthGuard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() data: Prisma.UserCreateInput) {
      return this.authService.register(data);
    }

    @Post('password-match')
    async passwordMatch(@Body() data: { username: string, password: string }) {
        return this.authService.passwordMatch(data.username, data.password);
    }

    @Put('password')
    async updatePassword(@Body() data: { username: string, password: string }) {
        return this.authService.updatePassword(data.username, data.password);
    }
}
