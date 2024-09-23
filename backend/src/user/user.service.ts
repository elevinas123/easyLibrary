import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
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
        const userFound = await this.userModel.findOne({
            username: username,
        });
        if (!userFound) {
            throw new NotFoundException(
                `User with username ${username} not found`
            );
        }
        return userFound;
    }
    async findOneByJwtPayload(jwt: string): Promise<User> {
        console.log("jwt", jwt);
        const decodedToken = this.jwtService.decode(jwt) as any; // Decode JWT payload
        const username = decodedToken?.username; // Extract data from JWT payload
        if (!username) {
            throw new Error("Invalid JWT");
        }

        // Fetch the user based on the username or other payload data
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
