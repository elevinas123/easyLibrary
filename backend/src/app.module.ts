import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookModule } from "./book/book.module";
import { BookshelveModule } from "./bookshelve/bookshelve.module";
import { UserModule } from "./user/user.module";
import { testControllerScanner } from "pathExtractor";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule available globally
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("MONGODB_URI"),
            }),
            inject: [ConfigService],
        }),
        JwtModule,
        UserModule,
        BookModule,
        BookshelveModule,
        AuthModule,
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor() {
        testControllerScanner();
    }
}
