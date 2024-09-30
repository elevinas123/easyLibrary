import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LocalAuthGuard } from "./localAuthGuard";
import { LoginDto } from "./dto/login-response.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
        console.log("createUserDto", createUserDto);
        return this.authService.register(createUserDto);
    }
}
