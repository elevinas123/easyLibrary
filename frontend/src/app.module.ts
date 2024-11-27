import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./Modules/Auth/api/auth/auth.module";
import { UserModule } from "./Modules/Auth/api/user/user.module";
import { BookModule } from "./Modules/LibraryPage/api/book/book.module";
import { BookshelveModule } from "./Modules/LibraryPage/api/bookshelve/bookshelve.module";
import { SettingsModule } from "./Modules/Settings/settings.module";

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
        SettingsModule,
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor() {}
}
