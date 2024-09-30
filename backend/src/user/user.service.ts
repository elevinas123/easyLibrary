import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ReturnModelType } from "@typegoose/typegoose"; // Correct model type for Typegoose
import { InjectModel } from "nestjs-typegoose"; // Correct import from nestjs-typegoose

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private userModel: ReturnModelType<typeof User>, // Correct usage with class reference
        private jwtService: JwtService
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOneByUsername(username: string): Promise<User> {
        const userFound = await this.userModel.findOne({ username }).exec();
        if (!userFound) {
            throw new NotFoundException(
                `User with username ${username} not found`
            );
        }
        return userFound;
    }

    async findOneByJwtPayload(jwt: string): Promise<User> {
        const decodedToken = this.jwtService.decode(jwt) as any;
        const username = decodedToken?.username;
        if (!username) {
            throw new Error("Invalid JWT");
        }
        return this.findOneByUsername(username);
    }

    async findOne(id: string): Promise<User> {
        const userFound = await this.userModel.findById(id).exec();
        if (!userFound) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return userFound;
    }

    async update(id: string, updateUserDto: CreateUserDto): Promise<User> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return deletedUser;
    }
}
