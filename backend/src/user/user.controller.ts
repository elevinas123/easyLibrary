import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client"; // Import Prisma's User type

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() data: Prisma.UserCreateInput): Promise<User> {
        return this.userService.create(data);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get("/findOneByJwtPayload")
    async findOneByJwtPayload(
        @Headers("authorization") authorization: string
    ): Promise<User> {
        const token = authorization.split(" ")[1];
        return this.userService.findOneByJwtPayload(token);
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Get("username/:username")
    async findOneByUsername(
        @Param("username") username: string
    ): Promise<User> {
        return this.userService.findOneByUsername(username);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() data: Prisma.UserUpdateInput
    ): Promise<User> {
        return this.userService.update(id, data);
    }

    @Delete(":id")
    async remove(@Param("id") id: string): Promise<User> {
        return this.userService.remove(id);
    }
}
