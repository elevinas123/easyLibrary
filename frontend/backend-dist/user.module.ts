import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
        JwtModule,
    ],
    exports: [UserService],
})
export class UserModule {}
