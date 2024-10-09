import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import { CreateUserDto } from "./create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./localAuthGuard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }
    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }
}
