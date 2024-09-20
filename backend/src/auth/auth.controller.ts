import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Post("login")
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }
}
