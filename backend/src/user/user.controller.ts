import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<User> {
        return this.userService.findOne(id);
    }
    @Get(":username")
    async findOneByUsername(@Param("username") username: string): Promise<User> {
        return this.userService.findOneByUsername(username);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() updateUserDto: CreateUserDto
    ){
        return this.userService.update(id, updateUserDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string): Promise<User> {
        return this.userService.remove(id);
    }
}
