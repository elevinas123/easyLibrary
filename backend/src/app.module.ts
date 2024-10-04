// src/app.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
<<<<<<< HEAD
import { JwtModule } from "@nestjs/jwt"; // Ensure proper configuration
import { TypegooseModule } from "nestjs-typegoose"; // Import TypegooseModule

=======
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
>>>>>>> MongooseBackend
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookModule } from "./book/book.module";
import { BookshelveModule } from "./bookshelve/bookshelve.module";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule available globally
        }),
        TypegooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const mongoUri = configService.get<string>("MONGODB_URI");
                console.log("MongoDB URI:", mongoUri);

                return {
                    uri: mongoUri!,
                };
            },
            inject: [ConfigService],
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || "default_secret",
            signOptions: { expiresIn: "60m" },
        }),
        UserModule,
        BookModule,
        BookshelveModule,
        AuthModule,
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
