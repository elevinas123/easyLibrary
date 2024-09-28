import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [TypegooseModule.forFeature([User]), JwtModule],
    exports: [UserService],
})
export class UserModule {}
